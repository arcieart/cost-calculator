import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  DocumentReference,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { ProductCost } from "../types/product";
import { AccessoriesState } from "../types/accessories";

const COLLECTION_NAME = "product-costs";

export interface SaveCalculationParams {
  productData: ProductCost;
  calculations: {
    totalCost: number;
    sellingPrice: number;
    profitAmount: number;
  };
}

export async function saveCalculation(params: SaveCalculationParams): Promise<string> {
  try {
    // Filter accessories to only include selected ones
    const selectedAccessories: AccessoriesState = {};
    Object.entries(params.productData.accessories).forEach(([key, accessory]) => {
      if (accessory.enabled) {
        selectedAccessories[key] = accessory;
      }
    });

    // Exclude id from saved data since it will be derived from document ID
    const { id, ...productDataWithoutId } = params.productData;
    
    const productData = {
      ...productDataWithoutId,
      accessories: selectedAccessories,
      totalCost: params.calculations.totalCost,
      sellingPrice: params.calculations.sellingPrice,
      profitAmount: params.calculations.profitAmount,
      createdAt: new Date(),
    };

    const docRef: DocumentReference = await addDoc(collection(db, COLLECTION_NAME), productData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving calculation:", error);
    throw new Error("Failed to save calculation");
  }
}

export async function loadCalculationHistory(): Promise<ProductCost[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const historyData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductCost[];

    return historyData;
  } catch (error) {
    console.error("Error loading history:", error);
    throw new Error("Failed to load calculation history");
  }
} 
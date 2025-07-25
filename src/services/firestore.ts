import { db, auth } from "../../firebase";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { ProductCost } from "../types/product";
import { AccessoriesState } from "../types/accessories";

const COLLECTION_NAME = "product-costs";

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

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
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to save calculations");
    }

    // Generate normalized document ID from product name
    const normalizedId = normalizeProductName(params.productData.productName);
    
    if (!normalizedId) {
      throw new Error("Product name cannot be empty or contain only special characters");
    }

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
      userId: auth.currentUser.uid, // Add the authenticated user's ID
      createdAt: new Date(),
    };

    const docRef = doc(db, COLLECTION_NAME, normalizedId);
    await setDoc(docRef, productData);
    return normalizedId;
  } catch (error) {
    console.error("Error saving calculation:", error);
    throw new Error("Failed to save calculation");
  }
}

export async function loadCalculationHistory(): Promise<ProductCost[]> {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to load calculation history");
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", auth.currentUser.uid), // Filter by current user's ID
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

export async function deleteCalculation(id: string): Promise<void> {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to delete calculations");
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting calculation:", error);
    throw new Error("Failed to delete calculation");
  }
} 
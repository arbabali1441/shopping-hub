import { JSONFilePreset } from 'lowdb/node';
import path from 'path';

export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface Data {
  products: Product[];
}

const file = path.join(process.cwd(), 'src/data/db.json');
const defaultData: Data = { products: [] };

export async function getDb() {
  return await JSONFilePreset<Data>(file, defaultData);
}

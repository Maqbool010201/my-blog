// src/lib/fetchData.js
export async function fetchLegalPages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/legal-pages`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch legal pages');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
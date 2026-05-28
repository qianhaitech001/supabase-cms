import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProduct, listAdminProductCategories } from "@/lib/admin-data";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), listAdminProductCategories()]);
  if (!product) notFound();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Edit Product</h1>
          <p>{product.title}</p>
        </div>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}

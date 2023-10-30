import getProducts from "@/src/actions/getProducts";
import HomeBanner from "@/src/components/HomeBanner";
import NullData from "@/src/components/NullData";
import ProductCard from "@/src/components/ProductCard";

export default async function Store() {
  const products = await getProducts();
  if (products.length === 0) {
    return (
      <NullData title="Oops! No products found. Click 'All' to clear filters." />
    );
  }
  return (
    <main className="p-8">
      <>
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products.map((product: any) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </div>
      </>
    </main>
  );
}

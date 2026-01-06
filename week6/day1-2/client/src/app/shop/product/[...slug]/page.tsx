"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { useProductDetail, useProducts } from "@/hooks/useProducts";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string[];
  const id = slug ? slug[0] : null;

  const { product, isLoading, error } = useProductDetail(id as string);
  const { products: relatedProducts } = useProducts({ limit: 4 });

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-gray-400 font-medium">LOADING PRODUCT...</div>
    </div>
  );

  if (error || !product) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-px border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product?.title ?? "product"} />
        <section className="mb-11">
          <Header data={product} />
        </section>
        <Tabs />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProducts} />
      </div>
    </main>
  );
}

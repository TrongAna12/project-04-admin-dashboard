import { NextResponse, type NextRequest } from "next/server";
import { productIdSchema } from "@/schemas/productSchema";
import { toOracleServiceError } from "@/services/oracle/errors";
import { getProductDetail } from "@/services/productService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const parsed = productIdSchema.safeParse(params.id);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product id." },
      { status: 400 }
    );
  }

  try {
    const product = await getProductDetail(parsed.data);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    const serviceError = toOracleServiceError(error);

    return NextResponse.json(
      {
        error: serviceError.message,
        code: serviceError.code,
      },
      { status: serviceError.status }
    );
  }
}

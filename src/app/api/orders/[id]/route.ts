import { NextResponse, type NextRequest } from "next/server";
import { saleOrderIdSchema } from "@/schemas/saleOrderSchema";
import { toOracleServiceError } from "@/services/oracle/errors";
import { getSaleOrderDetail } from "@/services/saleOrderService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const parsed = saleOrderIdSchema.safeParse(params.id);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sale order id." },
      { status: 400 }
    );
  }

  try {
    const saleOrder = await getSaleOrderDetail(parsed.data);

    if (!saleOrder) {
      return NextResponse.json(
        { error: "Sale order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(saleOrder);
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

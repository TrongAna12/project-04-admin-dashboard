import { NextResponse, type NextRequest } from "next/server";
import { saleOrderQuerySchema } from "@/schemas/saleOrderSchema";
import { toOracleServiceError } from "@/services/oracle/errors";
import { listSaleOrders } from "@/services/saleOrderService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = saleOrderQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid order query parameters.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const response = await listSaleOrders(parsed.data);
    return NextResponse.json(response);
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

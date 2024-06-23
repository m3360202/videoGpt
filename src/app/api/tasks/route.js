import { NextResponse } from 'next/server';

export async function POST(
  req,
  { params }
) {
  const { searchParams } = new URL(req.url);
  const column = searchParams.get("column");

  if (!column) {
    return NextResponse.json([]);
  }

  const data = await query.limit(50).get([primary_key, ui.relation.title]);
  return NextResponse.json(data.map((item) => {
    return {
      disabled: false,
      label: item[ui.relation.title],
      value: item[primary_key],
    }
  }));
}

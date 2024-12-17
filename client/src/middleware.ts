import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { EnumTokens } from "@/services/auth-token.service";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { url, cookies } = request;
	const refreshToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value;

	// Перевірка, чи це сторінка авторизації
	const isAuthPage = url.includes("/auth");

	if (isAuthPage) {
		// Якщо є токен, перенаправляємо на головну сторінку
		if (refreshToken) {
			return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url));
		}
		return NextResponse.next();
	}

	// Для захищених сторінок перенаправляємо на /auth, якщо немає токена
	if (!refreshToken) {
		// Можна також очистити куки, якщо токен недійсний
		const response = NextResponse.redirect(new URL("/auth", url));
		response.cookies.delete(EnumTokens.REFRESH_TOKEN); // Опціонально очищуємо токен

		return response;
	}

	// Якщо користувач має доступ, продовжуємо запит
	return NextResponse.next();
}

export const config = {
	matcher: ["/workspace/:path*", "/auth/:path*"], // Виправлено :path*
};

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ¡IMPORTANTE! Llamar a getUser() en cada petición asegura que Supabase 
  // pueda refrescar el token de sesión (cookie) si está a punto de caducar,
  // antes de que llegue a cualquier Server Component.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!roleData || roleData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  // El matcher define en qué rutas de tu aplicación se va a ejecutar este middleware.
  // Es fundamental para no saturar al servidor de Supabase ni penalizar el rendimiento.
  // 
  // La expresión regular siguiente hace que el middleware se ejecute en TODAS las rutas
  // EXCEPTO en las peticiones a archivos estáticos (que no necesitan sesión ni base de datos):
  // - _next/static (archivos construidos de JS y CSS, código del framework de Next)
  // - _next/image (optimización dinámica de imágenes proporcionada por Next.js)
  // - favicon.ico (el icono universal de la pestaña del navegador)
  // - Cualquier archivo con extensión de recursos (ej. .svg, .png, .jpg, .webp)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

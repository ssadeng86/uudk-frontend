import { useEffect } from "react";
import api from "@/lib/api";

/**
 * 사용: AppLayout 최상단에서 useAuthCheck();
 * 동작: /auth/check 호출 (쿠키 포함). 인증 안 되어있으면 서버의 인증 시작 엔드포인트로 이동.
 */
export function useAuthCheck() {
  useEffect(() => {
    let mounted = true;
    api
      .get("/auth/check")
      .then((res) => {
        if (!mounted) return;
        // 서버가 { authenticated: boolean } 반환하는 형식 가정
        if (!res.data?.authenticated) {
          // 백엔드가 카카오 auth URL로 리다이렉트 시켜줌
          // 여기선 백엔드 엔드포인트로 이동: 브라우저가 백엔드로 가서 카카오로 리다이렉트됨
          window.location.href = "/auth/kakao/redirect";
        }
      })
      .catch(() => {
        if (!mounted) return;
        window.location.href = "/auth/kakao/redirect";
      });
    return () => {
      mounted = false;
    };
  }, []);
}

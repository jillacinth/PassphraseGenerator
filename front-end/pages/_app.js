import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import '../styles/styles.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = secureLocalStorage.getItem("authenticated");

      console.log("Auth Status:", isAuthenticated); // Debugging

      if (router.pathname !== "/LoginPage" && router.pathname !== "/create") {
        if (!isAuthenticated) {
          router.push("/LoginPage");
        }
      }

      setIsLoading(false);
    }
  }, [router.pathname]);

  if (isLoading) return <p>Loading...</p>; // Prevents unnecessary redirections

  return <Component {...pageProps} />;
}

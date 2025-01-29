import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
        
      router.push('/signing'); // Redirect if token is missing
    }
    else{

    }
  }, [router]);
};

export default useAuthCheck;

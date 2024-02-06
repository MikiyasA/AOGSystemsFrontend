import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

  
  const withAuth = (WrappedComponent, allowedRoles = []) => {
    const Auth = (props) => {
      const router = useRouter();
  
      const { data: session, status } = useSession();
      const user = session?.user;
  
      useEffect(() => {
        if (status === 'loading') {
          // Optional: Show a loading spinner while session is being checked // TODO
          return;
        }
  
        if (!user) {
          router.push('/login'); // Redirect to login page if no user session
        }
  
        if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
          console.log({ router });
          // Handle unauthorized user based on roles
        }
      }, [user, session, status, router]);
  
      return <WrappedComponent {...props} />;
    };
  
    return Auth;
  };
  
  export default withAuth;
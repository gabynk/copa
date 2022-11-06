import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, prompAsync] = Google.useAuthRequest({
    clientId: '',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true);

      await prompAsync();

    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(true);
    }
  }

  async function signInWithGoogle(access_token: string) {

  }

  useEffect(() => {
    if (response?.type === 'success' && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      user,
      isUserLoading,
      signIn
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}
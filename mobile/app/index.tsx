import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import * as SecureStore from "expo-secure-store";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { api } from "../src/lib/api";
import { useRouter } from "expo-router";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/ecec59592d1c3ead2cfe",
};

export default function App() {
  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "ecec59592d1c3ead2cfe",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("register", {
      code,
    });
    console.log(response);
    const { token } = response.data;

    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    // console.log(
    //   "aq",
    //   makeRedirectUri({
    //     scheme: "nlwspacetime",
    //   })
    // );

    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOAuthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => promptAsync()}
        >
          <Text className="text-clack font-alt text-sm uppercase">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray- text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}

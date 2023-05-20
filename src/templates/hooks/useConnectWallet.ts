import { useEffect, useCallback } from "react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

interface IUseConnectWalletProps {
  signInMessage?: string;
  callbackUrl?: string;
}
const useConnectWallet = (
  { 
    signInMessage = "Sign in with Ethereum to the app.",
    callbackUrl = "/" 
  }: IUseConnectWalletProps
) => {
  // sign message
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork(); // select network
  const { address, isConnected } = useAccount(); // account
  const { connect, connectors } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session } = useSession();
  // MetaMask is installed
  const isInstalledMetamask = (connectors.length > 0) ? connectors[0].name === "MetaMask": false;

  const handleLogin = useCallback(async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: signInMessage,
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: true,
        signature,
        callbackUrl,
      });
    } catch (error) {
      // window.alert(error); add one alert
    }
  }, [address, chain, signMessageAsync]);

  useEffect(() => {
    if (isConnected && !session) {
      // handleLogin(); // 自動起動しないようにする
    }
  }, [isConnected, session, handleLogin]);

  return { handleLogin, connect, isConnected, isInstalledMetamask };
};

export default useConnectWallet;
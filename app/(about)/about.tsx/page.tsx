'use client'
import { Common } from "@/components/canvas/View";
import { Input, Form, Submit } from "@/components/canvas/items/r3f-form";
import Header from "@/components/commons/Header";
import { Cloud, OrthographicCamera, Sky, Svg, Text, useGLTF, useTexture } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Euler, Vector3 } from "three";
import { easing, geometry } from 'maath';
import Swal from "sweetalert2";
import { GrassPlane } from "@/components/canvas/items/r3f-form/grass/plane";
extend(geometry);

const View = dynamic(() => import("@/components/canvas/View").then(
  (mod) => mod.View as any
), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  )
});

const Page = () => {
  const fromYear = 2017;
  const font = "/fonts/MPLUS1-Light.ttf";
  const fontBold = "/fonts/MPLUS1-Bold.ttf";
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");
  const [name, setName] = useState<string>("");
  const [sw, setSw] = useState<"about" | "contact">("contact");
  const [company, setCompany] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const year = new Date().getFullYear() - fromYear;

  useEffect(() => {
    if (window.innerWidth < 768) {
      setDevice("mobile");
    } else {
      setDevice("desktop");
    }
  }, []);

  const SendEmail = async (e) => {
    e.preventDefault();
    if (name === "") {
      Swal.fire({
        icon: "warning",
        title: "お名前が入力されていません",
        text: "お名前を入力してください"
      });
      return;
    }
    if (email === "") {
      Swal.fire({
        icon: "warning",
        title: "メールアドレスが入力されていません",
        text: "メールアドレスを入力してください"
      });
      return;
    }
    if (message === "") {
      Swal.fire({
        icon: "warning",
        title: "お問い合わせ内容が入力されていません",
        text: "お問い合わせ内容を入力してください"
      });
      return;
    }
    // Email送信
    await fetch("/api/contact/sendmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, company, email, message
      })
    }).then(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "お問い合わせ内容を送信しました",
          });
          // フォームをリセット
          setName("");
          setCompany("");
          setEmail("");
          setMessage("");
        } else {
          Swal.fire({
            icon: "error",
            title: "お問い合わせ内容の送信に失敗しました",
          });
        }
      }
    );
  }

  const disabled = useMemo(() => {
    if (name === "" || email === "" || message === "") {
      return true;
    }
    return false;
  }, [name, email, message]);

  return (
    <>
      <Header />
      <div className="container relative mx-auto">
        {/** 後ろの背景 */}
        {/** @ts-ignore */}
        <View
          className="fixed left-0 z-0 h-screen w-full bg-transparent md:right-4"
        >
          <OrthographicCamera
            position={[0.1, 0.05, 4]}
            zoom={1}
          >
            <group
              rotation={[0, -Math.PI / 7, 0]}
              scale={
                device === "mobile" ? 0.5 : 0.8
              }
            >
              {/** 入力フォーム: (お名前, 会社名[任意], メールアドレス, お問い合わせ内容) */}
              {sw === "about" ?
                <>
                  <Text
                    font={font}
                    scale={0.05}
                    position={[-0.25, 0.4, 0]}
                    color={"#000000"}
                  >
                    About
                  </Text>
                  <Text
                    font={fontBold}
                    scale={0.04}
                    position={[-0.2, 0.3, 0]}
                    color={"#000000"}
                  >
                    SHO OSAKA
                  </Text>
                  <Text
                    font={font}
                    scale={0.025}
                    position={[-0.1, 0.2, 0]}
                    color={"#000000"}
                  >
                    実務経験{year}年
                    Web系のエンジニアです。
                  </Text>
                  <Text
                    font={font}
                    scale={0.025}
                    position={[-0.13, 0.15, 0]}
                    color={"#000000"}
                  >
                    主にWebGL含めフロントエンドや,
                  </Text>
                  <Text
                    font={font}
                    scale={0.03}
                    position={[-0.02, 0.10, 0]}
                    color={"#000000"}
                  >
                    Python, Nextjs使ったWeb/AIを扱ってます。
                  </Text>
                  <group
                    scale={0.004}
                    position={[-0.125, 0, 0]}
                  >
                    <Svg
                      position={[-50, 5, 0]}
                      scale={0.5}
                      src={"/img/logos/twitter.svg"}
                      onClick={() => {
                        window.open("https://twitter.com/sakanosho", "_blank");
                      }}
                    />
                    <Svg
                      position={[-15, 5, 0]}
                      scale={0.9}
                      src={"/img/logos/github.svg"}
                      onClick={() => {
                        window.open("https://github.com/foasho", "_blank");
                      }}
                    />
                    <Svg
                      position={[20, 5, 0]}
                      scale={0.25}
                      src={"/img/logos/zenn.svg"}
                      onClick={() => {
                        window.open("https://zenn.dev/solb", "_blank");
                      }}
                    />
                  </group>
                </>
                :
                <>
                  <Form
                    onSubmit={SendEmail}
                  >
                    <Text
                      font={font}
                      scale={0.05}
                      position={[0, 0.4, 0]}
                      color={"#000000"}
                    >
                      お名前
                    </Text>
                    <Input
                      name="message"
                      type="text"
                      scale={[0.5, 0.5, 0.5]}
                      font={font}
                      width={1}
                      position={[0, 0.3, 0]}
                      backgroundColor={"#FFF"}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Text
                      font={font}
                      scale={0.05}
                      position={[0, 0.2, 0]}
                      color={"#000000"}
                    >
                      {"会社名(任意)"}
                    </Text>
                    <Input
                      name="message"
                      type="text"
                      scale={[0.5, 0.5, 0.5]}
                      position={[0, 0.1, 0]}
                      font={"/fonts/MPLUS1-Light.ttf"}
                      width={1}
                      backgroundColor={"#FFF"}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                    <Text
                      font={font}
                      scale={0.05}
                      position={[0, 0, 0]}
                      color={"#000000"}
                    >
                      メールアドレス
                    </Text>
                    <Input
                      name="message"
                      type="text"
                      scale={[0.5, 0.5, 0.5]}
                      position={[0, -0.1, 0]}
                      font={font}
                      width={1}
                      backgroundColor={"#FFF"}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Text
                      font={font}
                      scale={0.05}
                      position={[0, -0.2, 0]}
                      color={"#000000"}
                    >
                      お問い合わせ内容
                    </Text>
                    <Input
                      name="message"
                      type="text"
                      scale={[0.5, 0.5, 0.5]}
                      position={[0, -0.3, 0]}
                      font={font}
                      width={1}
                      backgroundColor={"#FFF"}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Submit
                      font={font}
                      position={[0, -0.5, 0]}
                      backgroundColor={"#1E88E5"}
                      disabledColor={"#c2c2c2"}
                      disabled={disabled}
                      width={1}
                      scale={[0.5, 0.5, 0.5]}
                      roundness={0.12}
                      value={"メールを送信"}
                    />
                  </Form>
                  <mesh
                    position={[0, -0.055, -0.01]}
                  >
                    {/** @ts-ignore */}
                    <roundedPlaneGeometry args={[0.8, 1.2, 0.1]} />
                    <meshBasicMaterial
                      color={"#EFCB16"}
                    />
                  </mesh>
                </>
              }
            </group>
            <group
            >
              {sw === "contact" ?
                <MailBox 
                  position={
                    device === "mobile" ?
                      [-0.8, -0.3, 0.5]
                      :
                      [-1, -0.3, 0.5]
                  }
                  rotation={[0, Math.PI / 6, 0]}
                  scale={2.8}
                />
                :
                <>
                  <group
                    position={
                      device === "mobile" ?
                      [-0.3, 0.1, 0]
                      :
                      [-0.4, 0.1, 0]
                    }
                    rotation={[0, Math.PI / 6, 0]}
                  >
                    <ContactCircle 
                      onClick={() => setSw("contact")}
                    />
                  </group>
                </>
              }
            </group>
            <CameraRig />
          </OrthographicCamera>
          <Cloud
            opacity={0.9}
            color={"#FFFFFF"}
            speed={0.4}
            width={10}
            depth={4.5}
            segments={20}
            position={[0, 4.5, -10]}
            scale={0.2}
          />
          <Sky />
          <group
            position={[0, -0.5, 0]}
            scale={0.1}
          >
            <GrassPlane />
          </group>
          <Common color={"#1E90FF"} />
        </View>
      </div>
    </>
  )
}

const ContactCircle = ({
  onClick
}) => {
  const [emailTex] = useTexture([
    "/textures/email.png",
  ]);

  return (
    <group
      onClick={onClick}
    >
      <mesh>
        <circleGeometry args={[0.025, 32]} />
        <meshBasicMaterial
          color={"#ffffff"}
          map={emailTex}
          />
      </mesh>
      <Text
        scale={0.03}
        position={[0.08, -0.005, 0]}
        color={"#00BFFF"}
      >
        Contact
      </Text>
    </group>
  )
}

const CameraRig = () => {
  useFrame((state, delta) => {
    const range = 0.05;
    const d = 30;
    easing.damp3(
      state.camera.position,
      [-range + (state.pointer.x * state.viewport.width) / d,
      (range + state.pointer.y) / d, 5.5],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  })

  return (
    <></>
  )
}

interface IMailBoxProps {
  position?: [number, number, number] | Vector3;
  rotation?: [number, number, number] | Euler;
  scale?: number | [number, number, number] | Vector3;
}
const MailBox = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 3
}: IMailBoxProps) => {

  const { scene, nodes } = useGLTF("/models/mailbox.glb") as any;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}

export default Page;
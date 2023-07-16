"use client"
import React, { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber"
import {
  useGLTF,
  OrbitControls,
  RoundedBox,
  Environment,
} from "@react-three/drei";
import { StaticGeometryGenerator, MeshBVH } from "three-mesh-bvh";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MeshReflectorMaterial, Bvh } from "@react-three/drei";
import { Mesh, Vector3, Object3D, Material, Box3, Euler, Line3, Matrix4, Group, BufferGeometry, Raycaster, AnimationClip, AnimationAction, AnimationMixer, Color } from "three";
import { IInputMovement, useInputControl } from "@/hooks/useInputController";

export const MyScene = () => {
  const { raycaster } = useThree();
  raycaster.firstHitOnly = true;
  const grp: MutableRefObject<Group | null> = useRef<Group>(null);
  return (
    <>
      <Player grp={grp} objectURL="/models/fox.gltf" />
      <Field grp={grp} />
      <MyEnvironment />
    </>
  )
}

/**
 * Field
 */
const Field = (
  {
    grp
  }: { grp: React.RefObject<Group> }
) => {
  const citySize = 128;
  const mirrorResolution = 256;
  return (
    <Bvh>
      <Suspense>
        <group ref={grp}>
          {/** フロア */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.002, 0]}
            scale={[citySize, citySize, 1]}
            name="ground"
          >
            <planeGeometry />
            <MeshReflectorMaterial mirror={1} resolution={mirrorResolution} />
          </mesh>
          {/** 適当なBoxes, 位置も回転もばらばら */}
          {[...Array(1000)].map((_, i) => (
            <RandomBoxes
              key={i}
              index={i}
              citySize={citySize}
              maxHeight={3}
            />
          ))}
        </group>
      </Suspense>
    </Bvh>
  )
}

const RandomBoxes = (
  {
    index,
    citySize = 128,
    maxHeight = 3,
  }
) => {
  const seed = 191963927123;
  // X: -citySize/2~citySize/2, Y: 0~maxHeight, Z: citySize/2の範囲でランダムに配置
  const p = new Vector3(
    Math.random() * citySize - citySize / 2,
    Math.random() * maxHeight,
    Math.random() * citySize - citySize / 2
  );
  // 1~3のランダムなサイズ
  const size: number = Math.random() * 2 + 1;
  const color = useMemo(() => {
    return new Color().setHSL(Math.random(), 1.0, 0.5);
  }, []);
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[size, size, size]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
}

/**
 * プレイヤー操作
 */
interface IPlayerProps {
  grp: React.RefObject<Group>;
  objectURL: string;
  initPosition?: Vector3;
  initRotation?: Euler;
}
const Player = ({
  grp,
  objectURL = "/models/player.glb",
  initPosition = new Vector3(0, 10, 0),
  initRotation = new Euler(0, 0, 0),
}: IPlayerProps) => {
  const playerRef: MutableRefObject<Mesh | null> = useRef<Mesh>(null);
  const circleRef: MutableRefObject<Mesh | null> = useRef<Mesh>(null);
  const circleInitScale = 0.1;
  const circleMaxSize = 3;
  const circleSpeed = 2;
  const { scene, animations } = useGLTF(objectURL) as any;
  const [mixer, setMixer] = useState<AnimationMixer>();
  const [myActions, setMyActions] = useState<{ [x: string]: AnimationAction }>({});
  const p = initPosition ? initPosition : new Vector3(0, 0, 0);
  const circleP = p.clone().setY(0);

  useEffect(() => {
    if (scene && animations) {
      const _mixer = new AnimationMixer(scene);
      setMixer(_mixer);
      const _actions: { [x: string]: AnimationAction } = {};
      animations.forEach((clip: AnimationClip) => {
        _actions[clip.name] = _mixer.clipAction(clip);
      });
      setMyActions(_actions);
    }
  }, [scene, animations, objectURL]);

  useFrame((state, delta) => {
    if (circleRef.current && playerRef.current) {
      // XZ座標が同じ場合
      if (circleP.x === playerRef.current.position.x && circleP.z === playerRef.current.position.z) {
        //少しづつScaleを大きくしていく
        if (circleRef.current.scale.x < circleMaxSize) {
          circleRef.current.scale.x += circleSpeed * delta;
          circleRef.current.scale.y += circleSpeed * delta;
          circleRef.current.scale.z += circleSpeed * delta;
          // どんどん薄くしていく
          if (circleRef.current.material instanceof Material) {
            circleRef.current.material.opacity = 1 - circleRef.current.scale.x / circleMaxSize;
          }
        }
        else {
          circleRef.current.scale.set(circleInitScale, circleInitScale, circleInitScale);
          if (circleRef.current.material instanceof Material) {
            circleRef.current.material.opacity = 1;
          }
        }
      }
      else {
        // 非表示にする
        circleRef.current.visible = false;
      }
    }
  });
  return (
    <>
      <mesh
        ref={playerRef}
        position={p}
        rotation={initRotation ? initRotation : new Euler(0, 0, 0)}
      >
        <primitive object={scene} />
      </mesh>
      <PlayerControl object={playerRef} grp={grp} resetPosition={initPosition} actions={myActions} mixer={mixer} />
      <mesh ref={circleRef} scale={circleInitScale} position={circleP} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshStandardMaterial color="#00FFD8" roughness={0.75} transparent />
      </mesh>
    </>
  )
}


interface IPlayerControlProps {
  object: React.RefObject<Mesh | Object3D>;
  actions?: { [x: string]: AnimationAction };
  mixer?: AnimationMixer;
  grp: React.RefObject<Group>;
  cameraOffset?: Vector3;
  firstPerson?: boolean;
  resetPosition?: Vector3;
}
const PlayerControl = (
  {
    object,
    actions = {},
    mixer = undefined,
    grp,
    cameraOffset = new Vector3(-0.25, 1, -5),
    firstPerson,
    resetPosition = new Vector3(0.0, 3, -30)
  }: IPlayerControlProps) => {
  const { input } = useInputControl({});
  const orbitMove = useRef(false);
  const isInit = useRef(true);
  const player: React.MutableRefObject<Mesh | null> = useRef<Mesh>(null);
  const capsuleInfo = useRef<{ radius: number, segment: Line3 }>();
  capsuleInfo.current = {
    radius: 0.5,
    segment: new Line3(new Vector3(), new Vector3(0, - 1.0, 0.0))
  };
  const collider: MutableRefObject<Mesh | null> = useRef<Mesh>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  // --- ジャンプ/物理判定に関連する変数 ---
  const playerIsOnGround = useRef(false);
  const playerVelocity = useRef(new Vector3(0, 0, 0));
  const tempBox = new Box3();
  const tempVector = new Vector3();
  const tempVector2 = new Vector3();
  const tempMat = new Matrix4();
  const tempSegment = new Line3();
  const gravity = -30;
  const deadZone = -25;
  const upVector = new Vector3(0, 1, 0);
  const height = 2.0;
  const baseSpeed = 10; // 移動速度を調整できるように定数を追加
  const physicsSteps = 5;
  const desiredDistance = 7.5;
  const dashRatio = 2.1;
  // ---------------------------
  const { camera, gl } = useThree();
  const raycaster = new Raycaster();
  raycaster.firstHitOnly = true;
  const [mergeGeometry, setMergeGeometry] = useState<BufferGeometry>();
  useEffect(() => {
    if (player.current) {
      player.current.position.copy(
        resetPosition.clone()
      );
    }
    if (grp.current) {
      // grpをマージして衝突を行うオブジェクトを作成する
      const staticGenerator = new StaticGeometryGenerator(grp.current);
      staticGenerator.attributes = ["position"];
      const mergedGeometry = staticGenerator.generate();
      mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
      setMergeGeometry(mergedGeometry);
    }
  }, [
    grp.current,
    firstPerson,
  ]);

  useEffect(() => {
    // domElementに対して、タッチ操作を有効にする
    gl.domElement.addEventListener("touchstart", () => {
      orbitMove.current = true;
    });
    gl.domElement.addEventListener("touchend", () => {
      orbitMove.current = false;
    });
  }, [gl.domElement]);

  useEffect(() => {
    if (player.current) {
      player.current.geometry.translate(0, - 0.5, 0);
      // カメラを初期位置に設定
      camera.position.copy(resetPosition.clone().add(cameraOffset));
      if (isInit.current) {
        reset();
        isInit.current = false;
      }
    }
    return () => {
      if (player.current) {
        player.current.geometry.translate(0, 0.5, 0);
      }
      // 現在再生中のアニメーションを停止する
      for (const key in actions) {
        actions[key].stop();
      }
    }
  }, [actions]);

  const reset = () => {
    if (player.current) {
      playerVelocity.current.set(0, 0, 0);
      player.current.position.copy(resetPosition.clone());
      camera.position.sub(controls.current!.target);
      controls.current!.target.copy(player.current.position);
      camera.position.add(player.current.position);
      controls.current!.update();
    }
  }

  const updateAnimation = (input: IInputMovement, delta: number) => {
    if (input.forward !== 0 || input.backward !== 0 || input.left !== 0 || input.right !== 0) {
      // 歩きの時は歩きのアニメーションを再生
      if (actions["Walk"] && !input.dash) {
        actions["Walk"].play();
      }
      else if (actions["Run"] && input.dash) {
        // ダッシュの時はダッシュのアニメーションを再生
        actions["Run"].play();
      }
    }
    else {
      // 何もないときは、Idleを再生し、Idle以外が再生されていれば停止
      if (actions["Idle"]) {
        actions["Idle"].play();
        Object.keys(actions).forEach((key) => {
          if (key !== "Idle" && actions[key]) {
            actions[key].stop();
          }
        });
      }
    }
    // ジャンプのアニメーション
    if (actions["Jump"] && !playerIsOnGround.current) {
      actions["Jump"].play();
    }
    else if (actions["Jump"] && playerIsOnGround.current) {
      actions["Jump"].stop();
    }
    if (mixer) mixer.update(delta);
  }

  const updatePlayer = (delta: number) => {
    if (player.current && controls.current && mergeGeometry) {
      /**
       * 処理順序
       * 1. 入力データから移動方向ベクトルを計算
       * 　- 接地しているかどうか -> 重力分の移動ベクトルを追加
       * 　- 
       * 2. 衝突検出
       * 
       */
      if (playerIsOnGround.current) {
        playerVelocity.current.y = delta * gravity;
      }
      else {
        playerVelocity.current.y += delta * gravity;
      }
      player.current.position.addScaledVector(playerVelocity.current, delta);

      // 移動
      let speed = baseSpeed * input.speed;
      if (input.dash) {
        speed *= dashRatio;
      }
      const angle = controls.current.getAzimuthalAngle();
      const forwardAmount = input.forward - input.backward;
      let movementVector = new Vector3(0, 0, 0);
      if (forwardAmount !== 0) {
        tempVector.set(0, 0, -1 * forwardAmount).applyAxisAngle(upVector, angle);
        player.current.position.addScaledVector(tempVector, speed * delta);
        movementVector.add(tempVector);
      }
      const rightAmount = input.right - input.left;
      if (rightAmount !== 0) {
        tempVector.set(rightAmount, 0, 0).applyAxisAngle(upVector, angle);
        player.current.position.addScaledVector(tempVector, speed * delta);
        movementVector.add(tempVector);
      }
      player.current.updateMatrixWorld();

      // 移動量があれば、その移動方向に応じてObjectのY軸を回転させる
      if (forwardAmount !== 0 || rightAmount !== 0) {
        const targetRotation = Math.atan2(movementVector.x, movementVector.z);
        object.current!.rotation.y = targetRotation;
      }

      /**
       * 衝突検出
       */
      if (collider.current && capsuleInfo.current) {
        tempBox.makeEmpty();
        tempMat.copy(collider.current.matrixWorld).invert();
        tempSegment.copy(capsuleInfo.current.segment);

        // ローカル空間内のユーザーの位置を取得
        tempSegment.start.applyMatrix4(player.current.matrixWorld).applyMatrix4(tempMat);
        tempSegment.end.applyMatrix4(player.current.matrixWorld).applyMatrix4(tempMat);
        // 軸が整列した境界ボックスを取得
        tempBox.expandByPoint(tempSegment.start);
        tempBox.expandByPoint(tempSegment.end);

        tempBox.min.addScalar(- capsuleInfo.current.radius);
        tempBox.max.addScalar(capsuleInfo.current.radius);

        // 衝突を検出
        collider.current!.geometry!.boundsTree!.shapecast({
          intersectsBounds: (_box: Box3) => {
            return _box.intersectsBox(tempBox);
          },
          intersectsTriangle: (tri) => {
            const triPoint = tempVector;
            const capsulePoint = tempVector2;
            const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
            if (distance < capsuleInfo.current!.radius) {
              const depth = capsuleInfo.current!.radius - distance;
              const direction = capsulePoint.sub(triPoint).normalize();
              tempSegment.start.addScaledVector(direction, depth);
              tempSegment.end.addScaledVector(direction, depth);
            }
          }
        });
      }

      const newPosition = tempVector;
      newPosition.copy(tempSegment.start).applyMatrix4(collider.current!.matrixWorld);

      const deltaVector = tempVector2;
      deltaVector.subVectors(newPosition, player.current.position);

      playerIsOnGround.current = deltaVector.y > Math.abs(delta * playerVelocity.current.y * 0.25);

      const offset = Math.max(0.0, deltaVector.length() - 1e-5);
      deltaVector.normalize().multiplyScalar(offset);

      // Player(Capsule)とObjectの位置を同期
      player.current.position.add(deltaVector);
      if (object.current) {
        object.current.position.copy(player.current.position.clone().add(new Vector3(0, -(height - capsuleInfo.current!.radius), 0)));
      }
      if (!playerIsOnGround.current) {
        deltaVector.normalize();
        playerVelocity.current.addScaledVector(deltaVector, - deltaVector.dot(playerVelocity.current));
      } else {
        playerVelocity.current.set(0, 0, 0);
      }

      // カメラとの距離を調整
      camera.position.sub(controls.current.target);
      controls.current.target.copy(player.current.position);
      camera.position.add(player.current.position);

      // CameraからPlayerに向けてRaycastを行い、障害物があればカメラを障害物の位置に移動
      const objectPosition = player.current.position.clone().add(new Vector3(0, height / 2, 0));
      const direction = objectPosition.clone().sub(camera.position.clone()).normalize();
      const distance = camera.position.distanceTo(objectPosition);
      raycaster.set(camera.position, direction); // Raycast起源点をカメラに
      raycaster.far = distance - height / 2;
      raycaster.near = 0.01;
      raycaster.firstHitOnly = true;
      const intersects = raycaster.intersectObject(collider.current!, true); // 全てのオブジェクトを対象にRaycast
      if (intersects.length > 0) {
        // 複数のオブジェクトに衝突した場合、distanceが最も近いオブジェクトを選択
        const target = intersects.reduce((prev, current) => {
          return prev.distance < current.distance ? prev : current;
        });
        // この処理が完璧でないため、コメントアウト
        // camera.position.copy(target.point);
      }
      else if (forwardAmount !== 0 || rightAmount !== 0) {
        // 障害物との交差がない場合はプレイヤーから一定の距離を保つ
        const directionFromPlayerToCamera = camera.position.clone().sub(objectPosition).normalize();
        // カメラの位置をプレイヤーから一定の距離を保つように調整※カメラのカクツキを防ぐためにLerpを使用
        camera.position.lerp(objectPosition.clone().add(directionFromPlayerToCamera.multiplyScalar(desiredDistance)), 0.1);
      }

      // デッドゾーンまで落ちたらリセット
      if (player.current.position.y < deadZone) {
        reset();
      }
    }
  }

  useFrame((state, delta) => {
    const timeDelta = Math.min(delta, 0.1);
    // Jump
    if (input.jump && playerIsOnGround.current) {
      playerVelocity.current.setY(10.0);
      playerIsOnGround.current = false;
    }
    // OrbitsContolsの設定
    if (firstPerson && controls.current) {
      controls.current.maxPolarAngle = Math.PI;
      controls.current.minDistance = 1e-4;
      controls.current.maxDistance = 1e-4;
    }
    else if (controls.current) {
      // ThirdPerson
      controls.current.maxPolarAngle = Math.PI / (2 / 3);
      controls.current.minDistance = 1;
      controls.current.maxDistance = 10;
    }
    if (collider.current) {
      for (let i = 0; i < physicsSteps; i++) {
        updatePlayer(timeDelta / physicsSteps);
      }
    }
    if (controls.current) {
      controls.current.update();
    }
    updateAnimation(input, timeDelta);
  });
  return (
    <>
      <OrbitControls
        ref={controls}
        args={[camera, gl.domElement]}
        camera={camera}
        makeDefault={true}
      />
      <RoundedBox
        ref={player}
        visible={false}
        args={[1.0, height, 1.0]}
        radius={0.5}
        smoothness={2}
      >
        <meshBasicMaterial color="red" wireframe />
      </RoundedBox>
      {mergeGeometry &&
        <mesh
          ref={collider}
          visible={false}
          name="collider"
        >
          <primitive object={mergeGeometry} />
          <meshBasicMaterial wireframe color={0x00ff00} />
        </mesh>
      }
    </>
  )
};

/**
 * ----------------
 * Environment
 * ----------------
 */
const MyEnvironment = () => {
  return (
    <>
      <Environment preset="sunset" background blur={0.7} />
    </>
  )
}

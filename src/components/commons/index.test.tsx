import { Loading2D } from "./Loading2D";
import { Loading3D } from "./Loading3D";
import { SNSLinkPreview } from "./SNSLinkPreview";
import { render, screen, act, waitFor } from "@testing-library/react";
import ReactThreeTestRenderer from '@react-three/test-renderer';
import AuthProvider from "@/AuthProvider";

describe("Commons", () => {
  /**
   * Dom Testing
   */
  // Loading2D
  test("Commons/Loading2D", () => {
    render(<Loading2D />);
  });

  // SNSLinkPreview 調査中
  // test("Commons/SNSLinkPreview", async () => {
  //   render(<SNSLinkPreview text="https://twitter.com/sambecker/status/1707103051729789081" />);
  //   await waitFor(() => {
  //     expect(screen.getByText("")).toBeDefined();
  //   });
  // });

  /**
   * R3F Testing
   */
  // Loading3D
  test("Commons/Loading3D", async () => {
    const renderer = await ReactThreeTestRenderer.create(<Loading3D />);
    const mesh = renderer.scene.children[0];
    expect(mesh).toBeDefined();
  });

});
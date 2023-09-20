import Header from "@/components/dom/Header";
import { AboutComponent } from "./_components";

const Page = async () => {

  return (
    <>
      <Header />
      <div className="container relative mx-auto">
        <AboutComponent />
      </div>
    </>
  )
}

export default Page;
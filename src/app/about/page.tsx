import About from "@/components/About";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function AboutPage() {
  return (
    <MaxWidthWrapper>
      <div className="pt-16"> {/* Add padding for navbar */}
        <About />
      </div>
    </MaxWidthWrapper>
  );
}

import Features from "@/components/Features";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function FeaturesPage() {
  return (
    <MaxWidthWrapper>
      <div className="pt-16"> {/* Add padding for navbar */}
        <Features />
      </div>
    </MaxWidthWrapper>
  );
}

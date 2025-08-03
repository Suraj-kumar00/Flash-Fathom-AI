import Contact from "@/components/Contact";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function ContactPage() {
  return (
    <MaxWidthWrapper>
      <div className="pt-16"> {/* Add padding for navbar */}
        <Contact />
      </div>
    </MaxWidthWrapper>
  );
}

import FlashcardPro from "@/components/core/flash-card-pro";
import { auth } from '@clerk/nextjs/server';
import { subscriptionService } from '@/lib/services/subscription.service';
import { redirect } from 'next/navigation';

export default async function GenerateProPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in?redirect_url=/generate-pro');
  }

  // Check if user has Pro access
  const canAccessPro = await subscriptionService.canAccessProFeatures(userId);
  
  if (!canAccessPro) {
    redirect('/pricing?upgrade=required&redirect=/generate-pro');
  }

  return (
    <div className="page-container bg-slate-50 dark:bg-black">
      <FlashcardPro />
    </div>
  );
}
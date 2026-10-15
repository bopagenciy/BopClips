import React from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n';

// Banner for advanced tools (AI Shorts, AI Agent) that use fal.ai + ElevenLabs.
// These are BYOK: the plan covers the script/orchestration, the user brings their
// own keys for the premium generation. If they have no plan yet, also nudge trial.
export default function AdvancedBanner({ needsPlan, onKeys }) {
  const { t } = useLanguage();

  return (
    <div className="card mx-3 sm:mx-6 mt-3 px-3.5 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shrink-0 animate-fade">
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-sm min-w-0">
        <KeyRound size={16} className="shrink-0 text-warn mt-0.5 sm:mt-0" />
        <div className="text-ink2 lowercase leading-relaxed min-w-0">
          <span className="font-medium text-ink">{t('advancedBanner.title')}</span>{' '}
          {needsPlan
            ? t('advancedBanner.descFree')
            : t('advancedBanner.descKeys')}
        </div>
      </div>
      <button
        onClick={needsPlan ? () => { window.location.hash = '#/pricing'; } : onKeys}
        className="btn-quiet shrink-0 text-xs px-3 py-1.5 w-full sm:w-auto"
      >
        {needsPlan ? <>{t('advancedBanner.seePlans')} <ArrowRight size={14} /></> : t('advancedBanner.addKeys')}
      </button>
    </div>
  );
}

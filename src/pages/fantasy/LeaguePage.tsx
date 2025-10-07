import { List, Section } from '@telegram-apps/telegram-ui';
import { Suspense, type FC } from 'react';
import { PlaceSpinner } from '@/components/Loading';
import { LeagueContext, LeagueSelector } from '@/components/League';
import { TourSelector, TourContext, TourItem } from '@/components/Tour';
import { useGetTourParam, useLeagueParam, useUpdateTourParam } from '@/hooks';
import { SquadsTable } from '@/components/Squad';

/**
 * Main league page component for fantasy football league management.
 * Displays league selector, tour selector, tour information, and squads list.
 * Manages tour parameter updates and provides context for league and tour data.
 * Uses nested Suspense boundaries for progressive loading of different sections.
 *
 * @returns League page with selectors, tour info, and squads management
 */
export const LeaguePage: FC = () => {
  const updateTourParam = useUpdateTourParam();

  const leagueId = useLeagueParam();
  const tourId = useGetTourParam();

  return (
    <Suspense fallback={<PlaceSpinner />}>
      <LeagueContext value={leagueId}>
        <List>
          <LeagueSelector />
          <TourSelector tourId={tourId} onChange={updateTourParam} />
          <Suspense fallback={<PlaceSpinner />} key={tourId}>
            <TourContext value={tourId}>
              <Section>
                <TourItem />
              </Section>
              <Suspense
                fallback={
                  <Section>
                    <PlaceSpinner />
                  </Section>
                }
                key={tourId}
              >
                <SquadsTable />
              </Suspense>
            </TourContext>
          </Suspense>
        </List>
      </LeagueContext>
    </Suspense>
  );
};

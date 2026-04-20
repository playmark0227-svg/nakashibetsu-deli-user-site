import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GirlsClient from './GirlsClient';
import { getAllGirls } from '@/lib/api/girls';
import { getAllShops } from '@/lib/api/shops';
import { getSchedulesForGirls } from '@/lib/api/schedules';



export default async function GirlsPage() {
  const [girls, shops] = await Promise.all([
    getAllGirls(),
    getAllShops(),
  ]);

  const girlIds = girls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));

  const girlsWithSchedule = girls.map(girl => ({
    ...girl,
    schedule: scheduleMap.get(girl.id) || null,
  }));

  return (
    <>
      <Header />
      <GirlsClient girls={girlsWithSchedule} shops={shops} />
      <Footer />
    </>
  );
}

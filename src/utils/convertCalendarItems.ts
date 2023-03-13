import { Selector } from "components/pages/blocks/SelectorPage/types";
import parseISO from "date-fns/parseISO";
import { SelectorForm } from "store/content/types";

type SourceItem = SelectorForm & Selector;

export function convertItems(items: SourceItem[]) {
  const converted = items.map((item) => {
    return convertItem(item);
  });
  return converted;
}

export function convertItem(item: SelectorForm & Selector) {
  const startDate = parseISO(item.timestartutc + "Z");
  const duration = item?.ext?.duration_plan || 15;
  const durationTime = duration * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationTime);

  return {
    id: item.id,
    title: item.displayname,
    owner: item.user,
    comment: item.comment,
    startDate,
    endDate,
    participants: item.participants,
    enabled: item.enabled,
    // enabled: Math.random() > 0.5,
  };
}

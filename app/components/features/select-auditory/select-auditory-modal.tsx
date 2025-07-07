import { useSelector } from "react-redux";
import { ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { Button } from "~/components/ui/common/button";
import { SelectAuditoryTable } from "./select-auditory-table";
import { Separator } from "~/components/ui/common/separator";
import { InputSearch } from "~/components/ui/custom/input-search";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import type { AuditoriesTypes, AuditoryCategoriesTypes } from "~/store/auditories/auditories-types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import { scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";

interface ISelectAuditoryModal {
  open: boolean;
  isRemote: boolean;
  selectedAuditory: AuditoriesTypes | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsRemote: Dispatch<SetStateAction<boolean>>;
  setLessonActionsModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedAuditory: Dispatch<SetStateAction<AuditoriesTypes | null>>;
}

const SelectAuditoryModal: FC<ISelectAuditoryModal> = ({
  open,
  setOpen,
  isRemote,
  setIsRemote,
  selectedAuditory,
  setSelectedAuditory,
  setLessonActionsModalVisible,
}) => {
  const { auditoriCategories } = useSelector(auditoriesSelector);
  const { auditoryOverlay } = useSelector(scheduleLessonsSelector);

  const [preSelectedAuditory, setPreSelectedAuditory] = useState(selectedAuditory);
  const [freeAuditories, setFreeAuditories] = useState<AuditoryCategoriesTypes[]>([]);

  const onSelectedAuditory = () => {
    setSelectedAuditory(preSelectedAuditory);
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setLessonActionsModalVisible(true);
  };

  const checkAuditoryOverlay = () => {
    if (auditoryOverlay && auditoryOverlay.length) {
      const freeAuditories = (auditoriCategories || []).map((el) => {
        const auditories = el.auditories.filter((el) => auditoryOverlay.some((s) => s.id !== el.id));
        return { ...el, auditories };
      });
      setFreeAuditories(freeAuditories);
    }
  };

  const onClickRemote = (isChecked: boolean) => {
    setIsRemote(isChecked);

    if (isChecked) {
      setPreSelectedAuditory(null);
    } else {
      const auditoriesList = freeAuditories.flatMap((el) => el.auditories);
      setPreSelectedAuditory(auditoriesList[0]);
    }
  };

  // on first render set selected category and auditory if they exist
  useEffect(() => {
    setPreSelectedAuditory(null);
    if (!auditoriCategories || !auditoriCategories.length) return;

    auditoriCategories.forEach((category) => {
      const auditory = category.auditories.find((el) => el.id === selectedAuditory?.id);

      if (auditory && !isRemote) {
        setPreSelectedAuditory(auditory);
      }
    });
  }, [auditoriCategories, selectedAuditory]);

  // check all free auditories
  useEffect(() => {
    checkAuditoryOverlay();
  }, [auditoryOverlay]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть аудиторію:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Виберіть аудиторію, яка буде використовуватись для подальших дій
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <InputSearch className="mb-4 mx-4 mr-6" placeholder="Знайти аудиторію..." />

          <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
            {(auditoriCategories ?? []).map((category) => (
              <Collapsible key={category.id} className="pt-2 border mb-4" defaultOpen>
                <div className="flex items-center justify-between pl-4 pb-2 pr-2">
                  <h4 className="text-sm font-semibold">{category.name}</h4>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2">
                  <SelectAuditoryTable
                    auditories={category.auditories}
                    selectedAuditory={preSelectedAuditory}
                    setSelectedAuditory={setPreSelectedAuditory}
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button onClick={onSelectedAuditory}>Вибрати</Button>

          {preSelectedAuditory && (
            <div className="font-mono mr-3">
              Вибрано аудиторію:
              <span className="font-bold"> {preSelectedAuditory.name}</span>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectAuditoryModal;

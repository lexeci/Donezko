"use client";

import pageStyles from "@/app/page.module.scss";

import {Button, EntityItem} from "@/components/index";
import {useOrganization} from "@/context/OrganizationContext";
import {useFetchOrgs} from "@/hooks/organization/useFetchOrgs";
import generateKeyComp from "@/utils/generateKeyComp";
import {Buildings} from "@phosphor-icons/react";
import {Plus} from "@phosphor-icons/react/dist/ssr";
import {useState} from "react";
import OrganizationModal from "./OrganizationModal";

import styles from "./OrganizationElements.module.scss"

export default function OrganizationElements() {
    const {saveOrganization} = useOrganization();
    const {organizationList} = useFetchOrgs();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className={pageStyles["workspace-content-col"]}>
            {open && <OrganizationModal setOpen={setOpen}/>}
            <div className={pageStyles["workspace-basic-counter"]}>
                <div className={styles.title}>
                    <h4>Total Organizations: {organizationList?.length}</h4>
                </div>
                <Button type="button" onClick={() => setOpen(true)}>
                    <Plus size={22} className="mr-4"/> Organization
                </Button>
            </div>
            <div className={pageStyles["workspace-content-grid-3"]}>
                {organizationList?.map((item, i) => {
                    const {organization} = item;
                    const {_count} = organization;
                    return (
                        <EntityItem
                            key={generateKeyComp(`${organization.title}__${i}`)}
                            icon={<Buildings size={84}/>}
                            linkBase={`/workspace/organizations/${organization.id}`}
                            title={organization.title}
                            firstStat={`Participants: ${_count?.organizationUsers}`}
                            secondaryStat={`Teams: ${_count?.teams}`}
                            onClick={() => saveOrganization(organization.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

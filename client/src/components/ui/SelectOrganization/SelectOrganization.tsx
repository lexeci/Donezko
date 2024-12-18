"use client";

import { useOrganization } from "@/src/context/OrganizationContext";
import { useFetchOrgs } from "@/src/hooks/organization/useFetchOrgs";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx"; // Імпортуємо clsx для умовних класів
import { useState } from "react";
import { OrganizationModal } from "../../elements";

export default function SelectOrganization() {
	const { organizationId, saveOrganization } = useOrganization(); // Отримуємо organizationId з контексту
	const { organizationList } = useFetchOrgs();

	const [isOpen, setIsOpen] = useState(false); // Стейт для контролю відкриття списку
	const [openModal, setOpenModal] = useState<boolean>(false);

	const [selectedOrg, setSelectedOrg] = useState<string | null>(organizationId); // Зберігаємо вибрану організацію

	const handleSelectOrganization = (orgId: string) => {
		setSelectedOrg(orgId);
		saveOrganization(orgId); // Зберігаємо вибрану організацію в контексті
		setIsOpen(false); // Закриваємо список після вибору організації
	};

	return (
		<div className="relative flex flex-row items-center justify-center border-l border-l-foreground pl-6">
			{openModal && <OrganizationModal setOpen={setOpenModal} />}
			{/* Вибір організації або інформація про вибрану */}
			{selectedOrg ? (
				<div
					className="flex justify-center items-center text-center text-sm font-bold cursor-pointer"
					onClick={() => setIsOpen(!isOpen)}
				>
					<span>Selected: </span>
					<span className="ml-2 font-normal">
						{
							organizationList?.find(org => org.organization.id === selectedOrg)
								?.organization.title
						}
					</span>
				</div>
			) : (
				<div
					className="flex justify-center items-center cursor-pointer px-2 text-foreground"
					onClick={() => setIsOpen(!isOpen)}
				>
					<span className="text-sm font-bold">Select Organization</span>
				</div>
			)}

			{/* Список організацій */}
			{isOpen && (
				<div className="absolute top-[3.23rem] flex flex-col justify-start items-center gap-y-0.5 left-auto right-auto z-10 w-80 max-h-80 bg-background p-2 font-mono border-2 border-t-0 border-foreground shadow-lg overflow-auto">
					<div className="manage-org flex flex-row justify-space items-center w-full border-b border-foreground text-xs pb-1">
						<div className="title font-semibold">
							<h5>Actions:</h5>
						</div>
						<div
							className="item flex flex-row justify-center items-center border border-double border-foreground w-fit p-0.5 cursor-pointer hover:bg-hoverFill ml-auto"
							onClick={() => setOpenModal(true)}
						>
							<Plus size={12} className="mr-2" /> Organization
						</div>
					</div>

					<div className="flex flex-col text-xs border-t border-foreground w-full pt-1 gap-y-0.5">
						{organizationList?.map(org => {
							const isSelected = selectedOrg === org.organization.id; // Перевірка, чи вибрана організація
							return (
								<div
									key={org.organization.id}
									className={clsx(
										"cursor-pointer p-2 border border-foreground transition-colors",
										{
											"bg-hoverFill hover:bg-background": isSelected, // Фон для вибраної організації
											"hover:bg-hoverFill": !isSelected, // Сірий фон при наведенні
										}
									)}
									onClick={() =>
										!isSelected && handleSelectOrganization(org.organization.id)
									}
								>
									<div className="container border border-dashed border-foreground p-2">
										<div className="border-x px-1 border-foreground mb-0.5">{`Organization: ${org.organization.title}`}</div>
										<div className="border-x px-1 border-foreground mb-0.5">{`Members: ${
											org.organization._count?.organizationUsers || 0
										} / Projects: ${org.organization._count?.projects}`}</div>
										<div className="border-x px-1 border-foreground mb-0.5">{`Role: ${
											org.role || "N/A"
										}`}</div>
										<div className="border-x px-1 border-foreground">{`Status: ${
											org.organizationStatus || "Inactive"
										}`}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

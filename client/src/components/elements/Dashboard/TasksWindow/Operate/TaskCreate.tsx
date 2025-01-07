import {Button, Field, Select} from "@/components/index";
import {useOrganization} from "@/context/OrganizationContext";
import {useCreateTask} from "@/hooks/tasks/useCreateTask";
import {useFetchTeamsByProject} from "@/src/hooks/team/useFetchTeamsByProject";
import {useFetchUsersTeam} from "@/src/hooks/team/useFetchUsersTeam";
import {EnumTaskPriority, EnumTaskStatus, TaskFormData, TaskResponse,} from "@/types/task.types";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

interface TaskCreate {
    updateTaskList: Dispatch<SetStateAction<TaskResponse[] | undefined>>;
    filterDate: string | undefined;
    projectId: string | undefined;
}

export default function TaskCreate({
                                       updateTaskList,
                                       filterDate,
                                       projectId,
                                   }: TaskCreate) {
    const [teamsSelected, setTeamSelected] = useState<string>();
    const {organizationId} = useOrganization();
    const {teamList} = useFetchTeamsByProject(organizationId, projectId);
    const {teamUsers, handleRefetch: refetchTeamUsers} = useFetchUsersTeam({
        organizationId,
        id: teamsSelected,
    });

    const priority = Object.values(EnumTaskPriority);
    const status = Object.values(EnumTaskStatus);

    const {createTask} = useCreateTask();
    const {register, handleSubmit, setValue, reset} = useForm<TaskFormData>({
        mode: "onChange",
    });

    useEffect(() => {
        filterDate && setValue("createdAt", filterDate as unknown as Date);
        projectId && setValue("projectId", projectId);
    }, [filterDate]);

    useEffect(() => {
        organizationId && setValue("organizationId", organizationId);
    }, [organizationId]);

    const handleCreateCard = (data?: TaskResponse) => {
        if (data)
            updateTaskList(previousTasks => {
                return previousTasks ? [...previousTasks, data] : previousTasks;
            });
    };

    // Хендлер для вибору організації
    const handleTeamSelect = (value: string) => {
        setValue("teamId", value); // Встановлюємо це значення в форму
        setTeamSelected(value);
    };

    // Хендлер для вибору організації
    const handlePrioritySelect = (value: EnumTaskPriority) => {
        setValue("priority", value); // Встановлюємо це значення в форму
    };

    // Хендлер для вибору організації
    const handleStatusSelect = (value: EnumTaskStatus) => {
        setValue("taskStatus", value); // Встановлюємо це значення в форму
    };

    useEffect(() => {
        teamsSelected && refetchTeamUsers();
    }, [teamsSelected]);

    const handleUserSelect = (value: string) => {
        setValue("userId", value); // Встановлюємо це значення в форму
    };

    const onSubmit: SubmitHandler<TaskFormData> = data => {
        createTask(data, {
            onSuccess(data) {
                data && handleCreateCard(data);
                reset();
            },
        });
    };

    return (
        <div className="task-create-window flex flex-col justify-start items-center w-full">
            <div className="info py-4 border-b border-foreground">
                <div className="title text-lg font-semibold">
                    <h4>Creating a task</h4>
                </div>
                <div className="text-block whitespace-break-spaces">
                    <p>
                        This window allow you to create a new task within project and teams.
                    </p>
                </div>
            </div>
            <form
                className="w-full relative flex flex-col items-center flex-wrap md:justify-between gap-y-3 px-6 py-8"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Field
                    extra="flex flex-col max-w-80 w-full"
                    id="title"
                    label="Title:"
                    placeholder="Enter title:"
                    type="text"
                    {...register("title", {
                        required: "Title is required!",
                    })}
                />
                <Field
                    extra="flex flex-col max-w-80 w-full"
                    id="description"
                    label="Description:"
                    placeholder="Enter description"
                    type="text"
                    {...register("description", {
                        maxLength: {value: 500, message: "Description is too long"}, // Валідація на довжину
                    })}
                />
                <Select
                    id="status-select"
                    placeholder="Choose status (Optional)"
                    label="Select a status"
                    options={status.map(item => ({
                        value: item,
                        label: item,
                    }))}
                    onChange={data =>
                        handleStatusSelect(data.target.value as EnumTaskStatus)
                    }
                    extra="flex flex-col max-w-80 w-full"
                />
                <Select
                    id="priority-select"
                    placeholder="Choose priority (Optional)"
                    label="Select a priority"
                    options={priority.map(item => ({
                        value: item,
                        label: item,
                    }))}
                    onChange={data =>
                        handlePrioritySelect(data.target.value as EnumTaskPriority)
                    }
                    extra="flex flex-col max-w-80 w-full"
                />
                {teamList && (
                    <Select
                        id="team-select"
                        placeholder="Select team"
                        label="Select a team"
                        options={teamList.inProject.map(item => ({
                            value: item.id,
                            label: item.title,
                        }))}
                        onChange={data => handleTeamSelect(data.target.value)}
                        extra="flex flex-col max-w-80 w-full"
                    />
                )}
                {teamsSelected && teamUsers && (
                    <Select
                        id="team-user-select"
                        label="Assign a performer"
                        placeholder="Assign user to task (optional)"
                        options={teamUsers.map(item => ({
                            value: item.user.id,
                            label: item.user.name,
                        }))}
                        onChange={data => handleUserSelect(data.target.value)}
                        extra="flex flex-col max-w-80 w-full"
                    />
                )}
                <div className="flex items-center mt-4 gap-3 justify-center max-w-80 w-full">
                    <Button type="button" block>
                        Create Task
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default function TaskCreateInfo() {
    return (
        <div className="flex flex-col justify-start items-start w-full gap-y-4">
            <div className="header w-full border-b border-b-foreground pb-4">
                <div className="title text-lg font-bold mb-4">
                    <h5>How to Create a Task</h5>
                </div>
                <div className="description text-sm">
                    <p>
                        Follow the steps below to create a new task for your project and team.
                    </p>
                </div>
            </div>
            <div className="text-block flex flex-col justify-start items-start w-full gap-y-4">
                <p>1. Enter a title for the task in the <strong>"Title"</strong> field. This is a required field.</p>
                <p>2. Add a detailed description in the <strong>"Description"</strong> field (optional, max 500
                    characters).</p>
                <p>3. Select the <strong>status</strong> of the task from the dropdown menu (optional).</p>
                <p>4. Choose the <strong>priority</strong> for the task from the available options (optional).</p>
                <p>5. From the <strong>"Select Team"</strong> dropdown, choose the team responsible for this task.</p>
                <p>6. If a team is selected, assign a <strong>performer</strong> to the task from the list of team
                    members (optional).</p>
                <p>7. Once all required and optional fields are filled, click the <strong>"Create Task"</strong> button
                    to save the task.</p>
            </div>
            <div className="note text-xs border border-foreground p-2">
                <p>
                    Note: You must be part of an organization and have a project selected to create a task. Ensure all
                    required fields are completed to avoid errors.
                </p>
            </div>
        </div>
    );
}

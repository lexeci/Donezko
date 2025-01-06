export default function TaskUpdateInfo() {
    return (
        <div className="flex flex-col justify-start items-start w-full gap-y-4 p-4">
            <div className="header w-full border-b border-b-foreground pb-2">
                <div className="title text-lg font-bold">
                    <h5>How to Update a Task</h5>
                </div>
                <div className="description text-sm">
                    <p>
                        This guide walks you through the steps to update an existing task.
                    </p>
                </div>
            </div>
            <div className="text-block flex flex-col justify-start items-start w-full gap-y-4">
                <p>1. Ensure the task you want to update is selected.</p>
                <p>2. Modify the <strong>"Title"</strong> field if necessary. This field is required.</p>
                <p>3. Update the <strong>"Description"</strong> field if additional details or changes are needed
                    (optional, max 500 characters).</p>
                <p>4. Change the <strong>status</strong> of the task using the dropdown menu, if required.</p>
                <p>5. Update the <strong>priority</strong> of the task from the available options, if needed.</p>
                <p>6. Select a different <strong>team</strong> responsible for the task, if applicable.</p>
                <p>7. If a new team is selected, assign a new <strong>performer</strong> from the list of team members
                    (optional).</p>
                <p>8. Click the <strong>"Update Task"</strong> button to save your changes.</p>
            </div>
            <div className="note text-xs border border-foreground p-2">
                <p>
                    Note: Any fields left unchanged will retain their previous values. Ensure you have the necessary
                    permissions to modify tasks.
                </p>
            </div>
        </div>
    );
}

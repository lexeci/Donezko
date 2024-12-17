import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getInfo(): string {
		return `
    Welcome to TPlanner! <br/><br/>

    TPlanner is an innovative platform designed to streamline and enhance the management of organizations and teams. 
    Whether you are managing a small team or an enterprise organization, TPlanner provides a suite of tools to improve collaboration, 
    streamline communication, and empower team members to contribute effectively. 
<br/><br/>
    **Key Features:**<br/>
    - **Organization Management:** Easily create, update, and manage your organization’s structure.<br/>

    - **Role-based Access Control:** Assign roles such as OWNER, ADMIN, and VIEWER to control access and responsibilities.<br/>

    - **Team Collaboration:** Seamlessly manage team members, assign tasks, and track progress.<br/>

    - **User Permissions:** Flexibly configure who can perform specific actions within your organization.<br/>

    - **Organization Status:** Control membership status including ACTIVE and BANNED statuses to manage user participation.
<br/><br/>
    **How to Get Started:**<br/>
    1. Create your organization and invite users to join.<br/>

    2. Assign roles and permissions to organize your team effectively.<br/>

    3. Manage your team’s activities and ensure smooth collaboration by tracking and updating user roles and statuses.<br/>

    4. Transfer ownership or exit the organization with ease, depending on your needs.
<br/><br/>
    **Need Help?**<br/>
    If you have any questions or need assistance, please refer to the documentation or contact support.<br/>

    We're here to help you get the most out of TPlanner!
<br/><br/>

    Thank you for using TPlanner. We hope this platform enhances your team's productivity and collaboration!
<br/>
<br/>
    ---
    For more information, visit our <a href="http://localhost:3000/docs">documentation</a>.
    `;
	}
}

// types/express.d.ts

import { Role } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
            validated?: {
                body?: any;
                query?: any;
                params?: any;
            };
        }
    }
}

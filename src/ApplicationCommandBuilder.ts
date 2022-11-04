import ApplicationCommandOptionBuilder from "./ApplicationCommandOptionBuilder";
import {
    ApplicationCommandOptions,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    Permission,
    PermissionName,
    Permissions
} from "oceanic.js";

const permissionNames = Object.keys(Permissions).filter(p => !/^[0-9]+$/.test(p));
export default class ApplicationCommandBuilder<T extends ApplicationCommandTypes = ApplicationCommandTypes> {
    defaultMemberPermissions?: string;
    description?: string;
    descriptionLocalizations?: Record<string, string>;
    dmPermission?: boolean;
    name: string;
    nameLocalizations?: Record<string, string>;
    options: Array<ApplicationCommandOptions> = [];
    type: T;
    constructor(type: T, name: string) {
        this.type = type;
        this.name = name;
    }

    addDescriptionLocalization(locale: string, description: string): this {
        (this.descriptionLocalizations ??= {})[locale] = description;
        return this;
    }

    addNameLocalization(locale: string, name: string): this {
        (this.nameLocalizations ??= {})[locale] = name;
        return this;
    }

    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(option: ApplicationCommandOptionBuilder<O> | ApplicationCommandOptions): this;
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(name: string, type: O, extra?: ((this: ApplicationCommandBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | ApplicationCommandOptions): this;
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(...args: [name: string, type: O, extra?: ((this: ApplicationCommandBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | Omit<ApplicationCommandOptions, "name" | "type">] | [option: ApplicationCommandOptionBuilder<O> | ApplicationCommandOptions]): this {
        if (args.length === 1) {
            if (args[0] instanceof ApplicationCommandOptionBuilder) {
                args[0] = args[0].toJSON();
            }
            this.options.push(args[0]);
            return this;
        } else {
            const [name, type, extra] = args;
            const option = new ApplicationCommandOptionBuilder(type, name);
            if (extra) {
                if (typeof extra === "function") {
                    extra.call(this, option);
                    this.options.push(option.toJSON());
                } else {
                    this.options.push({ ...extra, name, type } as ApplicationCommandOptions);
                }
            } else {
                this.options.push(option.toJSON());
            }
            return this;
        }
    }

    allowDMUsage(): this {
        this.setDMPermission(true);
        return this;
    }

    disallowDMUsage(): this {
        this.setDMPermission(false);
        return this;
    }

    setDMPermission(dmPermission: boolean): this {
        this.dmPermission = dmPermission;
        return this;
    }

    setDefaultMemberPermissions(...permissions: [bigint | string | Permission | Array<PermissionName>] | Array<PermissionName>): this {
        let data: bigint | string | Permission | Array<PermissionName>;
        if (permissions.length > 1 || typeof permissions[0] === "string" && permissionNames.includes(permissions[0])) {
            data = permissions[0];
        } else {
            data = permissions as typeof data;
        }
        if (data instanceof Permission) {
            data = data.allow.toString();
        } else if (typeof data === "bigint") {
            data = data.toString();
        } else if (Array.isArray(data)) {
            data = data.map(perm => Permissions[perm]).reduce((a, b) => a | b, 0n).toString();
        }

        this.defaultMemberPermissions = data;
        return this;
    }

    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    setDescriptionLocalizations(localizations: Record<string, string>): this {
        this.descriptionLocalizations = localizations;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setNameLocalizations(localizations: Record<string, string>): this {
        this.nameLocalizations = localizations;
        return this;
    }
}

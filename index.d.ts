declare class Version {
    constructor(pkg: Package, opt: any);

    public name: string;
    public version: string;
    public readonly keywords: string[];
    public readonly description: string;
    public readonly dependencies: Registry.Dependencies;
    public readonly devDependencies: Registry.Dependencies;
    public readonly peerDependencies: Registry.Dependencies;
    public readonly npmVersion: string;
    public readonly nodeVersion: string;
    public readonly author: Registry.Human;
    public readonly npmUser: Registry.Human;
    public readonly maintainers: Registry.Human[];
    public readonly contributors: Registry.Human[];
    public readonly dist: Registry.Dist;
}

declare class Package {
    constructor(opt: any);

    version(version: string): Version;
    tag(tagName: string): string;
    publishedAt(version: string): Date;

    public readme: {
        file: string;
        content: string;
    };
    public readonly id: string;
    public readonly rev: string;
    public readonly name: string;
    public readonly description: string;
    public readonly author: Registry.Human;
    public readonly maintainers: Registry.Human[];
    public readonly tags: string[];
    public readonly lastVersion: string;
    public readonly versions: string[];
    public readonly keywords: string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly homepage: string;
    public readonly license: string;
    public readonly bugsURL: string;
}

declare class Registry {
    constructor(url?: string);

    public static DEBUG: boolean;
    public static DEFAULT_URL: "https://registry.npmjs.org";
    public static DEFAULT_API: "https://api.npmjs.org/";
    public url: string;
    public api_url: string;

    userPackages(userName: string): Promise<Registry.UserPackages>;

    package(name: string): Promise<Package>;
    package(name: string, version: string): Promise<Version>;
    package(name: string, version?: string): Promise<Package | Version>;
    search(options: Registry.SearchOptions): Promise<Registry.SearchResult>;
    metaData(): Promise<Registry.Meta>;
    login(auth: string): void;
    logout(): void;
    membership(scope: string, auth?: string): Promise<Registry.Roster>;

    downloads(packageName: string, options?: { type: "point" } & Registry.DownloadOptions): Promise<Registry.DownloadPoint>;
    downloads(packageName: string, options?: { type: "range" } & Registry.DownloadOptions): Promise<Registry.DownloadRange>;
    downloads(packageName: string, options?: Registry.DownloadOptions): Promise<Registry.DownloadPoint | Registry.DownloadRange>;
}

declare namespace Registry {

    interface DownloadPoint {
        downloads: number;
        start: string;
        end: string;
        package: string;
    }

    interface DownloadRow {
        day: string;
        downloads: number;
    }

    interface DownloadRange {
        downloads: DownloadRow[];
        start: string;
        end: string;
        package: string;
    }

    type Period = "last-day" | "last-week" | "last-month";
    interface DownloadOptions {
        period?: Period;
        type?: "point" | "range";
    }

    interface SearchOptions {
        text: string;
        size?: number;
        from?: number;
        quality?: number;
        popularity?: number;
        maintenance?: number;
    }

    interface UserPackages {
        [packageName: string]: "write" | "read";
    }

    interface Roster {
        [username: string]: "developer" | "admin" | "owner"
    }

    interface Meta {
        db_name: string;
        doc_count: number;
        doc_del_count: number;
        update_seq: number;
        purge_seq: number;
        compact_running: boolean;
        disk_size: number;
        data_size: number;
        instance_start_time: string;
        disk_format_version: number;
        committed_update_seq: number;
    }

    interface Bugs {
        url: string;
        email?: string;
    }

    interface Human {
        name: string;
        email?: string;
        username?: string;
        url?: string;
    }

    interface Repository {
        type: string;
        url: string
    }

    interface Dependencies {
        [depName: string]: string;
    }

    interface Dist {
        integrity?: string;
        shasum: string;
        tarball: string;
        fileCount?: number;
        unpackedSize?: number;
        "npm-signature"?: string;
    }

    interface SearchPackage {
        package: {
            name: string;
            scope: string;
            version: string;
            description: string;
            date: string;
            keywords: string[];
            links: {
                [name: string]: string;
            },
            author: Registry.Human;
            publisher: Registry.Human;
            maintainers: Registry.Human[];
        };
        score: {
            final: number;
            detail: {
                quality: number;
                popularity: number;
                maintenance: number;
            }
        };
        searchScore: number;
    }

    interface SearchResult {
        objects: SearchPackage[];
        total: number;
        time: string;
    }

}

export as namespace Registry;
export = Registry;

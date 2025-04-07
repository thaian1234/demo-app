import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    async findUser(params: Prisma.UserFindUniqueArgs) {
        return this.prisma.user.findUnique(params);
    }

    async findUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createUser(params: { data: Prisma.UserCreateInput; options?: Prisma.UserCreateArgs }) {
        const { data, options } = params;
        return this.prisma.user.create({
            data,
            ...options,
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
        options?: Prisma.UserUpdateArgs;
    }) {
        const { where, data, options } = params;
        return this.prisma.user.update({
            data,
            where,
            ...options,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.delete({
            where,
        });
    }
}

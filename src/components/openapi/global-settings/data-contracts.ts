/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type CreateTenantDto = Record<string, any>;

export type UpdateTenantDto = Record<string, any>;

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponseDto {
  meta: PaginationMeta;
}

export type TenantDto = Record<string, any>;

export type AssignAgentToTenantDto = Record<string, any>;

export type UnassignAgentFromTenantDto = Record<string, any>;

export type CreateAgentDto = Record<string, any>;

export type UpdateAgentDto = Record<string, any>;

export interface FindValidAgentsDto {
  agentIds: string[];
}

export type AgentDto = Record<string, any>;

export type AssignRoleToAgentDto = Record<string, any>;

export type UnassignRoleFromAgentDto = Record<string, any>;

export type CreateRoleDto = Record<string, any>;

export type UpdateRoleDto = Record<string, any>;

export interface FindValidRolesDto {
  roleIds: string[];
}

export type RoleDto = Record<string, any>;

export type CreateTenantMetadataDto = Record<string, any>;

export type TenantMetadataDto = Record<string, any>;

export type UpdateTenantMetadataDto = Record<string, any>;

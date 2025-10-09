"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationResponseDto = exports.PaginationMetaDto = exports.PaginationQueryDto = void 0;
exports.buildSortObject = buildSortObject;
exports.buildSearchFilter = buildSearchFilter;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PaginationQueryDto {
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = 'desc';
    search;
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "search", void 0);
class PaginationMetaDto {
    total;
    page;
    limit;
    totalPages;
    constructor(total, page, limit) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
class PaginationResponseDto {
    data;
    meta;
    constructor(data, total, page, limit) {
        this.data = data;
        this.meta = new PaginationMetaDto(total, page, limit);
    }
}
exports.PaginationResponseDto = PaginationResponseDto;
function buildSortObject(sortBy, sortOrder = 'desc') {
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    return sort;
}
function buildSearchFilter(search, searchFields) {
    if (!search || !searchFields.length)
        return {};
    const searchRegex = new RegExp(search, 'i');
    return {
        $or: searchFields.map(field => ({
            [field]: { $regex: searchRegex }
        }))
    };
}
//# sourceMappingURL=pagination.dto.js.map
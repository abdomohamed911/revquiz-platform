/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRequestBody {
  filters?: string;
  sort?: string;
  fields?: string;
  keywords?: string;
  page?: string;
  limit?: string;
  populate?: string;
}
interface IPagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
export class ApiFeatures {
  mongooseQuery;
  reqBody: IRequestBody;
  pagination: IPagination;

  constructor(mongooseQuery: any, reqBody: IRequestBody) {
    this.mongooseQuery = mongooseQuery;
    this.reqBody = reqBody;
    this.pagination = {
      currentPage: 1,
      limit: 20,
      totalPages: 0,
      totalResults: 0,
    };
  }

  filter() {
    // Reserved keys that are not filters
    const reserved = [
      "sort",
      "fields",
      "keywords",
      "page",
      "limit",
      "populate",
      "filters",
    ];
    // Use all non-reserved keys as filters
    const queryFilters: Record<string, any> = {};
    for (const [key, value] of Object.entries(this.reqBody)) {
      if (!reserved.includes(key) && value !== undefined && value !== "") {
        // Support for advanced filtering (e.g., price[gte]=10)
        if (key.includes("[")) {
          const match = key.match(/(\w+)\[(\w+)\]/);
          if (match) {
            const field = match[1];
            const op = match[2];
            if (!queryFilters[field]) queryFilters[field] = {};
            queryFilters[field][`$${op}`] = value;
            continue;
          }
        }
        queryFilters[key] = value;
      }
    }
    this.mongooseQuery = this.mongooseQuery.find(queryFilters);
    return this;
  }

  sort() {
    // Support sort from both query/body and params
    const sortValue = this.reqBody.sort || (this.reqBody as any).params?.sort;
    if (sortValue) {
      const sortBy = sortValue.split(" ").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // Support fields from both query/body and params
    const fieldsValue =
      this.reqBody.fields || (this.reqBody as any).params?.fields;
    if (fieldsValue) {
      const fields = fieldsValue.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-createdAt -__v");
    }
    return this;
  }

  search() {
    // Support keywords from both query/body and params
    const keywordsValue =
      this.reqBody.keywords || (this.reqBody as any).params?.keywords;
    if (keywordsValue) {
      const keywords = keywordsValue;
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: keywords, $options: "i" } },
          { description: { $regex: keywords, $options: "i" } },
        ],
      });
    }
    return this;
  }

  paginate(documentsCount?: number) {
    // Support page/limit from both query/body and params
    const pageValue = this.reqBody.page || (this.reqBody as any).params?.page;
    const limitValue =
      this.reqBody.limit || (this.reqBody as any).params?.limit;
    const page = parseInt(pageValue || "1") * 1 || 1;
    const limit = parseInt(limitValue || "20") || 20;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination.currentPage = page;
    this.pagination.limit = limit;
    this.pagination.totalResults = documentsCount || 0;
    this.pagination.totalPages = Math.ceil(
      this.pagination.totalResults / this.pagination.limit
    );
    return this;
  }

  populate() {
    // Support populate from both query/body and params
    const populateValue =
      this.reqBody.populate || (this.reqBody as any).params?.populate;
    if (populateValue) {
      this.mongooseQuery = this.mongooseQuery.populate(populateValue);
    }
    return this;
  }
}

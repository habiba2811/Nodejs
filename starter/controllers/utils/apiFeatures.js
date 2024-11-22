class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString }; //shallow copy of query object
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]); // delete fields from query object

    // 1) ADVANCED FILTERING
    // { duration: { $gt: 5 } }
    let queryStr = JSON.stringify(queryObj); // convert obj to string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // replace all gte, lte, gt, lt with $gte, $lte, $gt, $lt (lt = less than, gt = greater than, lte = less than or equal to, gte = greater than or equal to) \b is a word boundary /g is to replace all matches
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // sort by createdAt in descending order
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // exclude __v field
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // page 1 by default
    const limit = this.queryString.limit * 1 || 100; // 100 by default
    const skip = (page - 1) * limit; // 0, 100, 200
    this.query = this.query.skip(skip).limit(limit); // skip 0, 100, 200 and limit to 100, 100, 100

    return this;
  }
}

module.exports = APIFeatures;

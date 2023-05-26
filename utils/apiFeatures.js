class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        let keyword = this.queryString.keyword;
      
        if (!keyword) {
          return this;
        }
      
        if (Array.isArray(keyword)) {
          keyword = {
            $and: keyword.map((word) => ({
              $or: [
                { make: { $regex: word, $options: 'i' } },
                { model: { $regex: word, $options: 'i' } },
                { variant: { $regex: word, $options: 'i' } },
                { city: { $regex: word, $options: 'i' } },
                { color: { $regex: word, $options: 'i' } },
                { RTO: { $regex: word, $options: 'i' } },
              ],
            })),
          };
        } else {
          keyword = {
            $or: [
              { make: { $regex: keyword, $options: 'i' } },
              { model: { $regex: keyword, $options: 'i' } },
              { variant: { $regex: keyword, $options: 'i' } },
              { city: { $regex: keyword, $options: 'i' } },
              { color: { $regex: keyword, $options: 'i' } },
              { RTO: { $regex: keyword, $options: 'i' } },
            ],
          };
        }
      
        this.query = this.query.find({ ...keyword });
        return this;
      }
      
      
    filter() {
        const queryCopy = { ...this.queryString };

        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

};

export default ApiFeatures;
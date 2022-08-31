import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';



export class News extends Component {

  static defaultProps = {
    country: "in",
    pageSize: 5,
    category: "cricket"
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,

    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)}- News App`
  }

  async updateNews() {

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=71836241edcb4a0aa90f2c5b7db61ad2&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true })
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles, totalResults: parsedData.totalResults,
      loading: false,
      totalResults:0
    })


  }
  async componentDidMount() {

    this.updateNews()

  }

  
  handlePrevClick = async () => {

    this.setState({
      page: this.state.page - 1
    })
    this.updateNews()

  }

  handleNextClick = async () => {

    this.setState({
      page: this.state.page + 1
    })
    this.updateNews()
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

  }

  render() {

    return (
      <div className="container my-5 ">
        <h1 className='text-center' style={{ margin: "35px" }} >Top Headline's -{this.capitalizeFirstLetter(this.props.category)}</h1>
        {/* {this.state.loading && <Spinner />} */}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.lenght!==this.state.totalResults}
          loader={<Spinner/>}
        >

          <div className="row">
            {this.state.articles.map((element) => {

              return <div className="col-md-4 " key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} />
              </div>
            })}
          </div>
        </InfiniteScroll>
        < div className="container my-5 d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark mx-3" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark mx-3" onClick={this.handleNextClick}>Next&rarr;</button>
        </div>
      </div>
    )
  }
}
export default News
import * as React from 'react';
import router from 'umi/router';
import { formatMessage, getLocale, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { StickyContainer, Sticky } from 'react-sticky';
import { SearchBar, Grid, ListView } from 'antd-mobile';
import styles from './index.module.less';
import Top2 from './Top2';
import Top3 from './Top3';

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/queryRests'],
}))
class Home extends React.Component {
  constructor(props) {
    super(props);
    if (window.location && window.location.pathname.indexOf('/home') < 0) {
      router.replace('/home');
    }
  }

  state = {
    address: '当前地址',
  };
  // client and server both call
  static getInitialProps = async ({ store, route, isServer }) => {
    // new dva ins
    await store.dispatch({
      type: 'home/queryRests',
      payload: {
        offset: 0,
        limit: 8,
        extras: ['activities', 'tags'],
        extra_filters: 'home',
        rank_id: '',
        terminal: 'h5',
      },
    });
  }

  onSearch = value => {
    console.log('onSearch', value);
  };

  onEndReached = () => {
    const { loading, rank_id } = this.props;
    if (!loading) {
      this.loadRestaurantData(rank_id);
    }
  };

  getImage = hash => {
    const path = `${hash[0]}/${hash.substr(1, 2)}/${hash.substr(3)}`;

    let type = 'jpeg';
    if (path.indexOf('png') > -1) {
      type = 'png';
    }
    return `http://fuss10.elemecdn.com/${path}.${type}`;
  };

  getTypeData = () => {
    try {
      return this.state.headerData[0].entries.map(type => ({
        icon: this.getImage(type.image_hash),
        text: type.name,
      }));
    } catch (error) {
      return [];
    }
  };

  /**
   * 初始化
   * @param {Coordinates} coords 坐标
   */
  init() {
    this.loadTypeData();
    this.loadPoiData();
    this.loadRestaurantData();
  }

  rests = [];

  getListViewDataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  });

  /**
   * 加载分类数据
   * @param {Coordinates} coords 坐标
   */
  loadTypeData() {
    const { latitude, longitude } = this.props;
    fetch(
      `/restapi/shopping/openapi/entries?latitude=${latitude}&longitude=${longitude}&templates[]=main_template&templates[]=favourable_template&templates[]=svip_template`,
    )
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({
              headerData: data,
            });
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  /**
   * 加载地理数据
   * @param {Coordinates} coords 坐标
   */
  loadPoiData() {
    const { latitude, longitude } = this.props;
    // poi数据
    fetch(`/restapi/bgs/poi/reverse_geo_coding?latitude=${latitude}&longitude=${longitude}`)
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({
              address: data.name,
            });
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  /**
   * 加载餐厅数据
   * @param {Coordinates} coords 坐标
   * @param {number} rank_id rank id
   */
  loadRestaurantData(rank_id) {
    const { dispatch, rests } = this.props;
    console.log('---rests-', rests);
    dispatch({
      type: 'home/queryRests',
      payload: {
        offset: 0,
        limit: 8,
        extras: ['activities', 'tags'],
        extra_filters: 'home',
        rank_id,
        terminal: 'h5',
      },
    });
  }

  gotoDetail = data => {
    const { coords } = this.state;
    router.push({
      pathname: '/shop',
      query: {
        id: data.id,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  };

  renderRow = rowData => {
    if (!rowData) {
      return null;
    }

    const data = rowData.restaurant;
    return (
      <div className={styles.restItem} role="button" onClick={() => this.gotoDetail(data)}>

        <div className={styles.logo}>
          <img src={this.getImage(data.image_path)} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.title}>
            {data.is_premium ? <span className={styles.premium}>品牌</span> : null}
            {data.name}
          </div>
          <div className={styles.subInfo}>
            {data.rating} 月售{data.recent_order_num}单
          </div>
          <div className={styles.subInfo}>
            ¥{data.float_minimum_order_amount}起送 | {data.piecewise_agent_fee.tips}
            <div className={styles.right}>
              {data.distance}m | {data.order_lead_time}分钟
            </div>
          </div>
          {data.recommend && data.recommend.reason ? (
            <div className={styles.recommend} style={{ color: data.recommend.color }}>
              <div className={styles.logo}>
                <img src={this.getImage(data.recommend.image_hash)} alt="" />
              </div>
              {data.recommend.reason}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    const { address } = this.state;
    const { rests } = this.props;
    const dataSource = this.getListViewDataSource.cloneWithRows(rests);
    return (
      <div className={styles.home}>

        <hr />1-----------------------------------------------------------------
        <Top2 />
        <Top3 />
        <hr />


        <div className={styles.log}>
          IENUUUFunftwyftun LKEIRSTENFU
        </div>


        <header className={styles.header}>
          <div>
            <svg viewBox="0 0 26 31" id="location" width="28px" height="34px">
              <path
                fill="#FFF"
                fillRule="evenodd"
                d="M22.116 22.601c-2.329 2.804-7.669 7.827-7.669 7.827-.799.762-2.094.763-2.897-.008 0 0-5.26-4.97-7.643-7.796C1.524 19.8 0 16.89 0 13.194 0 5.908 5.82 0 13 0s13 5.907 13 13.195c0 3.682-1.554 6.602-3.884 9.406zM18 13a5 5 0 1 0-10 0 5 5 0 0 0 10 0z"
              />
            </svg>
            &nbsp;
            {address}
          </div>
        </header>
        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <div style={{ ...style, zIndex: 1, height: '1.2rem', overflow: 'hidden' }}>
                <SearchBar
                  placeholder={formatMessage({
                    id: 'hello'
                  })}
                  className={styles.search}
                  onSubmit={this.onSearch}
                />
              </div>
            )}
          </Sticky>
          <section className={styles.toptoon}>
            <img
              src="https://fuss10.elemecdn.com/0/cf/e16c1687a4ea84674d5b531623934png.png?imageMogr/format/webp/thumbnail/!750x210r/gravity/Center/crop/750x210/"
              alt="toptoon"
            />
          </section>
          <Grid
            className={styles.grid}
            data={this.getTypeData()}
            columnNum={5}
            carouselMaxRow={2}
            hasLine={false}
            activeStyle={false}
            isCarousel
            onClick={_el => console.log(_el)}
            renderItem={item => (
              <div className={styles.typeItem}>
                <div>
                  <img src={item.icon} alt={item.text} />
                </div>
                <div className={styles.text}>{item.text}</div>
              </div>
            )}
          />
          <div className={styles.ad}>
            <img
              src="https://fuss10.elemecdn.com/3/c8/45b2ec2855ed55d90c45bf9b07abbpng.png?imageMogr/format/webp/thumbnail/!710x178r/gravity/Center/crop/710x178/"
              alt="ad"
            />
          </div>
          <div className={styles.sep}>
            <div className={styles.seph} />
            推荐商家
            <div className={styles.seph} />
          </div>
          <ListView
            dataSource={dataSource}
            renderFooter={() => (
              <div style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading ? '加载中...' : 'footer'}
              </div>
            )}
            renderRow={this.renderRow}
            pageSize={4}
            useBodyScroll
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </StickyContainer>
      </div>
    );
  }
}

export default Home;

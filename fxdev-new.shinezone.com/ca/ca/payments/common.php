<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
date_default_timezone_set("Asia/shanghai");

/**
 * 添加公用方法类
 * 1-18
 */
require(dirname(__FILE__). "/Library/PDO.class.php");

class common {
    public $DB = null;

    //每一页1000条
    const PAGE_NUM = 500;

    public function __construct()
    {
        //引入配置文件
        $config = include "config.php";
        $this->initConn($config['mysql_server_name'], $config['mysql_database'], $config['mysql_username'], $config['mysql_password']);
    }

    public function initConn($mysql_server_name, $mysql_database, $mysql_username, $mysql_password) {
        if($this->DB === null) {
            $this->DB = new PDO_DB($mysql_server_name, $mysql_database, $mysql_username, $mysql_password);
        }
    }

    /**
     * 获取最近几天数据
     * @param $del
     * @return array
     */
    public function getRecentListByDate($del = -14) {
        $curDay = strtotime($del . 'day');

        $data = [];
        $lastDay = date('Y-m-d', $curDay);
        $nowDay = date('Y-m-d', $curDay) . ' 23:59:59';

        $where = "select MainAmount from payment WHERE BookingDate <= :creationDate_l and BookingDate >= :creationDate_b";
        $result = $this->DB->query($where, array('creationDate_l' => $nowDay, 'creationDate_b' => $lastDay));

        foreach($result as $row) {
            $data[] = $row['MainAmount'];
        }

        return $data;
    }

    /**
     * 获取最近几天数据
     * @param $limit
     * @return array
     */
    public function getRecentListOrderByDate($limit = 10) {
//        $data = [];

        $todayTime = date('Y-m-d H:i:s');
        $where = "select RecordType,BookingDate,paymentMethod,MainAmount,MainCurrency from payment WHERE 1 ORDER BY BookingDate DESC limit " . $limit;
        $result = $this->DB->query($where, array());

//        foreach($result as $row)
//        {
//            $data[] = $row;
//        }

        return $result;
    }

    /**
     * 默认页数
     * @return int
     */
    public function returnPageNum() {
        return self::PAGE_NUM;
    }

    /**
     * 获取当前订单详细
     * 1，默认时间限制
     * 2，默认取最新1000条
     * @param $sql
     * @param array $parameters
     * @param string $orderBy
     * @param int $limitFrom
     * @return mixed
     */
    public function getOrderList($sql, $parameters = array(), $orderBy = '', $limitFrom = 1) {
        $todayTime = date('Y-m-d H:i:s');
        $sql .= ' and ' . "BookingDate <= '" . $todayTime . "' " . $orderBy . " limit " . ($limitFrom - 1) * self::PAGE_NUM . ", " . self::PAGE_NUM;

        return $this->DB->query($sql, $parameters);
    }

    /**
     * 获取全部表单数量
     * @return int
     */
    public function countOrderList() {
        $result =  $this->DB->query("select count(*) as c from payment");

        return $result[0]['c'];
    }

    /**
     * 这里默认剩余当前状态
     * @param $result
     * @return array
     */
    public function formatDataLeftLastOne($result) {
        //先默认用LOW的方法，遍历实现
        $filterResultTmp = $filterResult = array();
        foreach($result as $row)
        {
            $filterResultTmp[$row['MerchantReferenceId']] = $row;
        }

        return $filterResultTmp;
    }

    /**
     * 1，调试输出log
     * @param $msg
     */
    public function dump($msg) {
        print_r('<pre>');
        var_export($msg);
    }

    /**
     * 1，直接调用mysql类
     * @param $sql
     * @param $parameters
     * @return mixed
     */
    public function sqlQuery($sql, $parameters) {
        return $this->DB->query($sql, $parameters);
    }

    /**
     * 传入条件，进行筛选
     * @param $parameters
     * @return mixed
     */
    public function getOrderListByCondition($parameters) {
        $where = 1;
        if($parameters) {
            foreach($parameters as $key => $value) {
                if($value || $value === 0) {
                    $where .= ' and ' . $key . '=:' . $key;
                } else {
                    unset($parameters[$key]);
                }
            }
        }

        //这里加上时间判断
        $where .= " and BookingDate <= '" . date('Y-m-d H:i:s') . "'";

        return $this->sqlQuery('select * from payment where ' . $where, $parameters);
    }


    /**
     * 传入条件，进行筛选|特殊情况处理
     * @param $parameters
     * @param $where
     * @return mixed
     */
    public function getOrderListByConditionAndSql($where, $parameters) {
        return $this->sqlQuery('select * from payment where ' . $where, $parameters);
    }

    /**
     * 1，根据URL传入的地区和日期选择出当前数据查询结果
     * 2，表结构：daydata
     * @param string $filterKey 匹配字段
     * @param string $searchKey 累加字段
     * @param string $doubleFilterKey 2段匹配字段
     * @param int $limit 限制匹配条数
     * @return array
     */
    public function getAreaSession($filterKey = 'area', $searchKey = 'session', $doubleFilterKey = '', $limit = 0) {
        //1，按照世界每个州来分
        //2，按照国家来分
        $keySave = ['area', 'country', 'method', 'amount', 'status', 'account', 'channel', 'categoryId'];
        if(!in_array($filterKey, $keySave)) {
            die('common.php -> key send error!');
        }

        //TODO 优化，看能否直接查询
        $mysqlKey = [$filterKey];
        $searchKey          && $mysqlKey[] = $searchKey;
        $doubleFilterKey    && $mysqlKey[] = $doubleFilterKey;

        if($searchKey) {
            $mysqlKey = implode($mysqlKey, ',');
        } else {
            $mysqlKey = '*';
        }

        //1，查询语句
        $sql = 'select ' . $mysqlKey . ' from daydata where 1';

        //2，筛选条件
        $conditions = [];
        if(isset($_REQUEST['bdate']) && $_REQUEST['bdate']) {
            $conditions['bdate'] = $_REQUEST['bdate'];
            $sql .= ' and date >= :bdate';
        }

        if(isset($_REQUEST['edate']) && $_REQUEST['edate']) {
            $conditions['edate'] = $_REQUEST['edate'];
            $sql .= ' and date <= :edate';
        }

        if(isset($_REQUEST['region']) && $_REQUEST['region']) {
            $conditions['region'] = $_REQUEST['region'];
            $sql .= ' and area = :region';
        }

        if(isset($_REQUEST['reportstartdate']) && $_REQUEST['reportstartdate']) {
            $conditions['reportstartdate'] = $_REQUEST['reportstartdate'];
            $sql .= ' and date >= :reportstartdate';
        }

        if(isset($_REQUEST['reportenddate']) && $_REQUEST['reportenddate']) {
            $conditions['reportenddate'] = $_REQUEST['reportenddate'];
            $sql .= ' and date <= :reportenddate';
        }

        //3，处理结果
        $sessions = [];
        $data = $this->sqlQuery($sql, $conditions);

        if($doubleFilterKey) {
            //有2个匹配字段，比如，查询所有alipay的下面的类型=完成状态的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];
                $areaKey2 = $row[$doubleFilterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey][$areaKey2])) {
                        $sessions[$areaKey][$areaKey2] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey][$areaKey2] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][$areaKey2][] = $row;
                }
            }
        } else {
            //只有一个匹配字段，比如，查询所有alipay的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey])) {
                        $sessions[$areaKey] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][] = $row;
                }
            }
        }

        return $sessions;
    }

    /**
     * ==============这里临时区分方法，防止特殊变数=========================
     * 1，根据URL传入的地区和日期选择出当前数据查询结果
     * 2，表结构：acquirer
     * @param string $filterKey 匹配字段
     * @param string $searchKey 累加字段
     * @param string $doubleFilterKey 2段匹配字段
     * @return array
     */
    public function getAcquirerAccount($filterKey = 'method', $searchKey = 'account', $doubleFilterKey = '') {
        //1，按照世界每个州来分
        //2，按照国家来分

        //TODO 优化，看能否直接查询
        $mysqlKey = [$filterKey];
        $searchKey          && $mysqlKey[] = $searchKey;
        $doubleFilterKey    && $mysqlKey[] = $doubleFilterKey;

        if($searchKey) {
            $mysqlKey = implode($mysqlKey, ',');
        } else {
            $mysqlKey = '*';
        }

        //1，查询语句
        $sql = 'select ' . $mysqlKey . ' from acquirer where 1';

        //2，筛选条件
        $conditions = [];
        if(isset($_REQUEST['bdate']) && $_REQUEST['bdate']) {
            $conditions['bdate'] = $_REQUEST['bdate'];
            $sql .= ' and date >= :bdate';
        }

        if(isset($_REQUEST['edate']) && $_REQUEST['edate']) {
            $conditions['edate'] = $_REQUEST['edate'];
            $sql .= ' and date <= :edate';
        }

        if(isset($_REQUEST['region']) && $_REQUEST['region']) {
            $conditions['region'] = $_REQUEST['region'];
            $sql .= ' and area = :region';
        }

        //3，处理结果
        $sessions = [];
        $data = $this->sqlQuery($sql, $conditions);

        if($doubleFilterKey) {
            //有2个匹配字段，比如，查询所有alipay的下面的类型=完成状态的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];
                $areaKey2 = $row[$doubleFilterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey][$areaKey2])) {
                        $sessions[$areaKey][$areaKey2] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey][$areaKey2] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][$areaKey2][] = $row;
                }
            }
        } else {
            //只有一个匹配字段，比如，查询所有alipay的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey])) {
                        $sessions[$areaKey] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][] = $row;
                }
            }
        }

        return $sessions;
    }

    /**
     * 1，根据条件，操作数据结构
     * 2，表结构：通用
     * @param array $data 原始数据
     * @param string $filterKey 匹配字段
     * @param string $searchKey 累加字段
     * @param string $doubleFilterKey 2段匹配字段
     * @return array
     */
    public function formatArrayByCondition($data, $filterKey = 'area', $searchKey = 'session', $doubleFilterKey = '') {
        $sessions = [];

        if($doubleFilterKey) {
            //有2个匹配字段，比如，查询所有alipay的下面的类型=完成状态的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];
                $areaKey2 = $row[$doubleFilterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey][$areaKey2])) {
                        $sessions[$areaKey][$areaKey2] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey][$areaKey2] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][$areaKey2][] = $row;
                }
            }
        } else {
            //只有一个匹配字段，比如，查询所有alipay的总额
            foreach($data as $row) {
                $areaKey = $row[$filterKey];

                //若不指定累加的值，则直接返回数组
                if($searchKey) {
                    if(isset($sessions[$areaKey])) {
                        $sessions[$areaKey] += $row[$searchKey];
                    } else {
                        $sessions[$areaKey] = $row[$searchKey];
                    }
                } else {
                    $sessions[$areaKey][] = $row;
                }
            }
        }

        return $sessions;
    }
}

/**
 * 工具类
 * Class ToolFunction
 */
class ToolFunction{
    public  static function export_csv($filename, $data)
    {
        header("Content-type:text/csv");
        header("Content-Disposition:attachment;filename=".$filename);
        header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
        header('Expires:0');
        header('Pragma:public');
        echo $data;
    }
}


//test
//$test = new common();
//$data = $test->getRecentListOrderByDate();
//var_dump($data);

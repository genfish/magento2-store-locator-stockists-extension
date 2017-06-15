<?php
declare(strict_types=1);
/**
 * Limesharp_Stockists extension
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MIT License
 * that is bundled with this package in the file LICENSE
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/mit-license.php
 *
 * @category	Limesharp
 * @package		Limesharp_Stockists
 * @copyright	2017 Claudiu Creanga
 * @license		http://opensource.org/licenses/mit-license.php MIT License
 * @author		Claudiu Creanga & David Buxarrais
 */

namespace Limesharp\Stockists\Controller\Ajax;

use Limesharp\Stockists\Model\ResourceModel\Stores\CollectionFactory as StockistsCollectionFactory;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;

use \Magento\Store\Model\StoreManagerInterface;

/**
 * Responsible for loading page content.
 *
 * This is a basic controller that only loads the corresponding layout file. It may duplicate other such
 * controllers, and thus it is considered tech debt. This code duplication will be resolved in future releases.
 */
class Stores extends \Magento\Framework\App\Action\Action
{
	
	/**
	 * @var JsonFactory
	 */
	protected $resultJsonFactory;

	/**
	 * @var StockistsCollectionFactory
	 */
	public $stockistsCollectionFactory;

	protected $storeManager;

	public function __construct(
		Context $context,
		JsonFactory $resultJsonFactory,
		StockistsCollectionFactory $stockistsCollectionFactory,
		StoreManagerInterface $storeManager
	) {
		$this->stockistsCollectionFactory = $stockistsCollectionFactory;
		$this->resultJsonFactory = $resultJsonFactory;
		$this->storeManager = $storeManager;

		parent::__construct($context);
	}

	/**
	 * Load the page defined in view/frontend/layout/stockists_index_index.xml
	 *
	 * @return \Magento\Framework\Controller\Result\JsonFactory
	 */
	public function execute()
	{
		// $collection = $this->collectionFactory->create()->getData();

		// $json = [];
		// foreach ($collection as $stockist) {
		// 	$json[] = $stockist;
		// }
		// return  $this->resultJsonFactory->create()->setData($json);

		$json = [];

		$params = $this->getRequest()->getParams();

		$collection = $this->stockistsCollectionFactory->create();

		$types = ['turismo', 'moto', 'camion', 'agricola', 'renting'];

		foreach ($types as $type)
		{
			if ( isset($params[$type]) and $params[$type] == 1 )
			{
				$collection->addFieldToFilter($type, $params[$type]);
			}
		}

		if ( isset($params['region']) )
		{
			$collection->addFieldToFilter('region', $params['region']);
		}

		if ( isset($params['city']) )
		{
			$collection->addFieldToFilter('city', $params['city']);
		}

		if ( isset($params['type']) )
		{
			$collection->getSelect()->group($params['type']);
			$collection->setOrder($params['type'], 'ASC');
		}
		else
		{
			$collection->setOrder('name', 'ASC');
		}

		$stockists = $collection->getData();

		$store_id = $this->storeManager->getStore()->getId();

		foreach ($stockists as $stockist)
		{
			if ( !in_array( $store_id, explode(",", $stockist['store_id']) ) )
				continue;

			$json[] = $stockist;
		}

		return $this->resultJsonFactory->create()->setData($json);
	}
}

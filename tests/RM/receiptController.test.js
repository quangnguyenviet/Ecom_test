import receiptController from '../../src/controllers/receiptController';
import receiptService from '../../src/services/receiptService';

jest.mock('../../src/services/receiptService');

describe('receiptController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('createNewReceipt', () => {
        test('RM_receiptController_TC_001 [test_handleCreateNewReceipt_success] - should return 200 and data from service', async () => {
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.createNewReceipt.mockResolvedValue(mockData);
            req.body = { userId: 1 };

            await receiptController.createNewReceipt(req, res);

            expect(receiptService.createNewReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        test('RM_receiptController_TC_002 [test_handleCreateNewReceipt_error] - should return error from server on exception', async () => {
            receiptService.createNewReceipt.mockRejectedValue(new Error('Test Error'));

            await receiptController.createNewReceipt(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('getDetailReceiptById', () => {
        test('RM_receiptController_TC_003 [test_getDetailReceiptById_success] - should return 200 and data', async () => {
            const mockData = { errCode: 0, data: {} };
            receiptService.getDetailReceiptById.mockResolvedValue(mockData);
            req.query.id = 1;

            await receiptController.getDetailReceiptById(req, res);

            expect(receiptService.getDetailReceiptById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe('getAllReceipt', () => {
        test('RM_receiptController_TC_004 [test_getAllReceipt_success] - should return 200 and data', async () => {
            const mockData = { errCode: 0, data: [] };
            receiptService.getAllReceipt.mockResolvedValue(mockData);
            req.query = { limit: 10, offset: 0 };

            await receiptController.getAllReceipt(req, res);

            expect(receiptService.getAllReceipt).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe('updateReceipt', () => {
        test('RM_receiptController_TC_005 [test_updateReceipt_success] - should return 200 and data', async () => {
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.updateReceipt.mockResolvedValue(mockData);
            req.body = { id: 1 };

            await receiptController.updateReceipt(req, res);

            expect(receiptService.updateReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe('deleteReceipt', () => {
        test('RM_receiptController_TC_006 [test_deleteReceipt_success] - should return 200 and data', async () => {
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.deleteReceipt.mockResolvedValue(mockData);
            req.body = { id: 1 };

            await receiptController.deleteReceipt(req, res);

            expect(receiptService.deleteReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe('createNewReceiptDetail', () => {
        test('RM_receiptController_TC_007 [test_createNewReceiptDetail_success] - should return 200 and data', async () => {
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.createNewReceiptDetail.mockResolvedValue(mockData);
            req.body = { receiptId: 1 };

            await receiptController.createNewReceiptDetail(req, res);

            expect(receiptService.createNewReceiptDetail).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });
});

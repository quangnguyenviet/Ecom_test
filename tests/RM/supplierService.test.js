import supplierService from '../../src/services/supplierService';
import db from '../../src/models/index';

jest.mock('../../src/models/index');

describe('supplierService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.Supplier = {
            create: jest.fn(),
            findOne: jest.fn(),
            findAndCountAll: jest.fn(),
            destroy: jest.fn(),
        };
    });

    describe('createNewSupplier', () => {
        const mockData = {
            name: 'Test Supplier',
            address: '123 Supplier St',
            phonenumber: '0123456789',
            email: 'supplier@test.com'
        };

        test('RM_supplierService_TC_012 [test_createNewSupplier_success] - should create a new supplier successfully', async () => {
            db.Supplier.create.mockResolvedValue({});
            const result = await supplierService.createNewSupplier(mockData);
            expect(db.Supplier.create).toHaveBeenCalledWith(mockData);
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });

        test('RM_supplierService_TC_013 [test_createNewSupplier_missing_params] - should return error if missing required parameters', async () => {
            const result = await supplierService.createNewSupplier({ name: 'Test' });
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('getDetailSupplierById', () => {
        test('RM_supplierService_TC_014 [test_getDetailSupplierById_success] - should get supplier detail by ID', async () => {
            db.Supplier.findOne.mockResolvedValue({ id: 1, name: 'Supplier A' });
            const result = await supplierService.getDetailSupplierById(1);
            expect(result.errCode).toBe(0);
            expect(result.data.name).toBe('Supplier A');
        });

        test('RM_supplierService_TC_015 [test_getDetailSupplierById_missing_id] - should return error if ID is missing', async () => {
            const result = await supplierService.getDetailSupplierById(null);
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('getAllSupplier', () => {
        test('RM_supplierService_TC_016 [test_getAllSupplier_success] - should get all suppliers with filter', async () => {
            db.Supplier.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
            const result = await supplierService.getAllSupplier({ limit: 10, offset: 0, keyword: 'test' });
            expect(result.errCode).toBe(0);
            expect(db.Supplier.findAndCountAll).toHaveBeenCalled();
        });
    });

    describe('updateSupplier', () => {
        test('RM_supplierService_TC_017 [test_updateSupplier_success] - should update supplier successfully', async () => {
            const mockSupplier = { id: 1, save: jest.fn() };
            db.Supplier.findOne.mockResolvedValue(mockSupplier);
            const data = { id: 1, name: 'New Name', address: 'New Add', phonenumber: '1', email: 'e' };
            const result = await supplierService.updateSupplier(data);
            expect(mockSupplier.save).toHaveBeenCalled();
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });
    });

    describe('deleteSupplier', () => {
        test('RM_supplierService_TC_018 [test_deleteSupplier_success] - should delete supplier successfully', async () => {
            db.Supplier.findOne.mockResolvedValue({ id: 1 });
            db.Supplier.destroy.mockResolvedValue(1);
            const result = await supplierService.deleteSupplier({ id: 1 });
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });
    });
});
